-- Gamification, XP, Level, Achievement & Streak System — schema.
--
-- Extends, rather than duplicates, the avatar/badge/unlock system from
-- 0022/0023: `badges`/`profile_badges` remain the one achievement store
-- (gains a `category` column here), `avatar_items`/`profile_unlocked_items`
-- remain the one avatar-reward store. `profiles.points` remains the XP
-- counter. This migration adds: an XP ledger (the anti-farming mechanism),
-- streak fields, quiz persistence, missions, challenges, and analytics.

-- ---------------------------------------------------------------------
-- XP ledger — every XP grant becomes a row here. A profile's XP is still
-- just `profiles.points` (unchanged, still the fast-read total); this
-- table exists so (a) "how I earned my XP" is answerable, and (b) grants
-- can be checked for idempotency by (profile_id, source_type, source_id)
-- before `points` is touched — see `award_xp()` in the next migration.
-- ---------------------------------------------------------------------
create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount int not null,
  reason text not null,
  source_type text not null check (source_type in
    ('LESSON', 'QUIZ', 'CHALLENGE', 'MISSION', 'CONTRIBUTION', 'STREAK', 'ACHIEVEMENT', 'PATHWAY', 'SPECIAL_EVENT')),
  source_id uuid,
  created_at timestamptz not null default now()
);

create index xp_events_profile_id_idx on public.xp_events(profile_id);
create index xp_events_profile_created_idx on public.xp_events(profile_id, created_at desc);

alter table public.xp_events enable row level security;

create policy "Users can read their own XP history"
  on public.xp_events for select
  using (auth.uid() = profile_id);

-- No insert policy — rows are written exclusively by the SECURITY DEFINER
-- award_xp() function in 0025, same "server decides" convention as
-- notifications and profile_unlocked_items.

-- ---------------------------------------------------------------------
-- Streak fields — scalars on profiles, same reasoning as `points`: a
-- handful of counters read on every profile load don't need a join.
-- ---------------------------------------------------------------------
alter table public.profiles add column current_streak int not null default 0;
alter table public.profiles add column longest_streak int not null default 0;
alter table public.profiles add column last_learning_date date;
alter table public.profiles add column streak_freeze_available int not null default 0;
alter table public.profiles add column leaderboard_visible boolean not null default false;

-- ---------------------------------------------------------------------
-- Quiz persistence — the checkpoint quiz in LessonDetailScreen has always
-- been 100% client-local state with no DB row at all. This is the
-- minimum needed to award quiz XP exactly once per lesson.
-- ---------------------------------------------------------------------
alter table public.lesson_progress add column quiz_completed boolean not null default false;
alter table public.lesson_progress add column quiz_score int;
alter table public.lesson_progress add column quiz_total int;

-- ---------------------------------------------------------------------
-- Achievements — extending badges with a category, for grouping in the
-- category-mastery UI and for filtering the achievement list by area.
-- ---------------------------------------------------------------------
alter table public.badges add column category text;
update public.badges set category = case
  when badge_id = 'first_lesson' then 'general'
  when badge_id = 'five_lessons' then 'career'
  when badge_id = 'first_creation' then 'creator'
  when badge_id = 'pillar_entrepreneur' then 'entrepreneurship'
  when badge_id = 'pillar_stem' then 'digital'
  when badge_id = 'level_4' then 'general'
  else 'general'
end;

-- ---------------------------------------------------------------------
-- Missions — admin/SQL-configurable catalog + per-profile progress.
-- Daily/weekly "rotation" is deterministic date-based selection computed
-- client-side over the active catalog (see src/context/AppContext.jsx) —
-- no scheduler needed. `period_key` (an ISO date for daily, an ISO week
-- like '2026-W07' for weekly) makes "already did today's/this week's
-- mission" a natural composite key rather than a separate lookup.
-- ---------------------------------------------------------------------
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  pillar text check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  cadence text not null check (cadence in ('daily', 'weekly')),
  steps jsonb not null default '[]',
  xp_reward int not null default 0,
  badge_id text references public.badges(badge_id),
  avatar_item_id text references public.avatar_items(item_id),
  active boolean not null default true,
  sort_order int not null default 0
);

alter table public.missions enable row level security;
create policy "Missions are publicly readable" on public.missions for select using (true);

-- Surrogate `id` (not a composite PK) so a completed instance's id can
-- serve as a stable, per-period xp_events.source_id — the same mission
-- recurring next week/day must be able to grant XP again, which a fixed
-- catalog `mission_id` as the idempotency key would incorrectly block.
create table public.user_missions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  period_key text not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  step_progress jsonb not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (profile_id, mission_id, period_key)
);

alter table public.user_missions enable row level security;

create policy "Users can read their own mission progress"
  on public.user_missions for select
  using (auth.uid() = profile_id);

create policy "Users can start and update their own missions"
  on public.user_missions for insert
  with check (auth.uid() = profile_id);

create policy "Users can update their own mission progress"
  on public.user_missions for update
  using (auth.uid() = profile_id);

-- ---------------------------------------------------------------------
-- Challenges — a distinct, structured entity from the free-text
-- `challenge_submission` contribution content-type. A practical/creator/
-- community challenge is *fulfilled* by submitting a contribution that
-- references it (see contributions.challenge_id below); a knowledge
-- challenge is fulfilled directly (client marks user_challenges complete
-- after a quiz-style check, mirroring the lesson checkpoint quiz).
-- ---------------------------------------------------------------------
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  pillar text check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  challenge_type text not null check (challenge_type in ('knowledge', 'practical', 'creator', 'community')),
  difficulty int not null check (difficulty between 1 and 3),
  xp_reward int not null default 0,
  badge_id text references public.badges(badge_id),
  avatar_item_id text references public.avatar_items(item_id),
  active boolean not null default true
);

alter table public.challenges enable row level security;
create policy "Challenges are publicly readable" on public.challenges for select using (true);

-- Admin-managed catalog, same spirit as topics: curated, not crowdsourced.
create policy "Admins can manage challenges"
  on public.challenges for all
  using (public.is_admin())
  with check (public.is_admin());

create table public.user_challenges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  status text not null default 'started' check (status in ('started', 'completed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (profile_id, challenge_id)
);

alter table public.user_challenges enable row level security;

create policy "Users can read their own challenge progress"
  on public.user_challenges for select
  using (auth.uid() = profile_id);

create policy "Users can start their own challenges"
  on public.user_challenges for insert
  with check (auth.uid() = profile_id);

-- Only knowledge-type challenges (quiz-style) can be self-completed by
-- the client directly. Practical/creator/community challenges are only
-- ever marked complete by the SECURITY DEFINER trigger on `contributions`
-- (notify_contribution_avatar, in 0025) when a linked submission is
-- published — a student can't just click "done" on those without
-- actually creating something.
create policy "Users can complete their own knowledge challenges"
  on public.user_challenges for update
  using (
    auth.uid() = profile_id
    and exists (select 1 from public.challenges c where c.id = challenge_id and c.challenge_type = 'knowledge')
  );

-- A submission can (optionally) fulfil a practical/creator/community
-- challenge. Nullable — every existing contribution stays unaffected.
alter table public.contributions add column challenge_id uuid references public.challenges(id);

-- ---------------------------------------------------------------------
-- Analytics — lightweight, fire-and-forget from the client (unlike XP,
-- which is always server-decided). The one new table with a client
-- insert policy.
-- ---------------------------------------------------------------------
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  event_name text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index analytics_events_profile_id_idx on public.analytics_events(profile_id);

alter table public.analytics_events enable row level security;

create policy "Users can log their own analytics events"
  on public.analytics_events for insert
  with check (auth.uid() = profile_id);

create policy "Admins can read analytics events"
  on public.analytics_events for select
  using (public.is_admin());

-- =======================================================================
-- Seed data
-- =======================================================================

-- Expanded achievement list (supersedes/extends the 6 seeded in 0022).
insert into public.badges (badge_id, name, description, icon, color, category, criteria) values
  ('first_step', 'First Step', 'Completed your first Zazi lesson.', 'PartyPopper', '#FF8A00', 'general', '{"kind":"lesson_count","count":1}'),
  ('curious_mind', 'Curious Mind', 'Completed lessons across 3 different pillars.', 'Compass', '#006E68', 'general', '{"kind":"pillar_variety_count","count":3}'),
  ('money_smart', 'Money Smart', 'Completed 5 financial literacy activities.', 'PiggyBank', '#F4B84C', 'finance', '{"kind":"pillar_lesson_count","pillar":"finance","count":5}'),
  ('future_founder', 'Future Founder', 'Completed 5 entrepreneurship challenges.', 'Rocket', '#E8603C', 'entrepreneurship', '{"kind":"pillar_challenge_count","pillar":"entrepreneurship","count":5}'),
  ('stem_explorer', 'STEM Explorer', 'Completed 3 STEM & digital activities.', 'Cpu', '#006E68', 'digital', '{"kind":"pillar_lesson_count","pillar":"digital","count":3}'),
  ('digital_pioneer', 'Digital Pioneer', 'Completed 7 digital skills activities.', 'Laptop2', '#0D665F', 'digital', '{"kind":"pillar_lesson_count","pillar":"digital","count":7}'),
  ('creator', 'Creator', 'Published your first contribution.', 'Palette', '#0D665F', 'creator', '{"kind":"contribution_count","count":1}'),
  ('voice_of_zazi', 'Voice of Zazi', 'Published 5 contributions.', 'Megaphone', '#5F9770', 'creator', '{"kind":"contribution_count","count":5}'),
  ('community_builder', 'Community Builder', 'Completed a civic & community activity.', 'HandHeart', '#5F9770', 'civic', '{"kind":"pillar_lesson_count","pillar":"civic","count":1}'),
  ('career_explorer', 'Career Explorer', 'Completed 10 career pathway lessons.', 'Briefcase', '#FF8A00', 'career', '{"kind":"pillar_lesson_count","pillar":"career","count":10}'),
  ('consistent', 'Consistent', 'Maintained a 7-day learning streak.', 'Flame', '#E8603C', 'general', '{"kind":"streak","count":7}'),
  ('future_shaper', 'Future Shaper', 'Reached Level 10.', 'Sparkles', '#F4B84C', 'general', '{"kind":"level","level":10}')
on conflict (badge_id) do nothing;

-- Daily missions — one per pillar, per the brief's exact list.
insert into public.missions (code, title, description, pillar, cadence, steps, xp_reward, sort_order) values
  ('daily_career', 'Career Explorer', 'Explore one career pathway.', 'career', 'daily', '[{"label":"Explore a career pathway lesson"}]', 70, 1),
  ('daily_money', 'Budget Builder', 'Build a simple weekly budget.', 'finance', 'daily', '[{"label":"Complete a money lesson or challenge"}]', 70, 2),
  ('daily_business', 'Idea Starter', 'Create a business idea.', 'entrepreneurship', 'daily', '[{"label":"Complete an entrepreneurship lesson or challenge"}]', 70, 3),
  ('daily_stem', 'Problem Solver', 'Solve a practical STEM problem.', 'digital', 'daily', '[{"label":"Complete a STEM lesson or challenge"}]', 70, 4),
  ('daily_digital', 'Safety Check', 'Complete a digital safety challenge.', 'digital', 'daily', '[{"label":"Complete a digital skills lesson or challenge"}]', 70, 5),
  ('daily_leadership', 'Speak Up', 'Complete a communication activity.', 'leadership', 'daily', '[{"label":"Complete a leadership lesson or challenge"}]', 70, 6),
  ('daily_community', 'Local Lens', 'Learn about an issue affecting your community.', 'civic', 'daily', '[{"label":"Complete a community lesson or challenge"}]', 70, 7)
on conflict (code) do nothing;

-- The one flagship weekly mission specified in full by the brief.
insert into public.missions (code, title, description, pillar, cadence, steps, xp_reward, badge_id, avatar_item_id, sort_order) values
  ('weekly_future_founder', 'Future Founder', 'Build your first business idea, from problem to pitch.', 'entrepreneurship', 'weekly',
    '[{"label":"Learn how entrepreneurs identify problems","xp":30},{"label":"Identify a problem in your community","xp":30},{"label":"Create a business solution","xp":50},{"label":"Pitch your idea in 60 seconds","xp":100}]',
    210, 'future_founder', 'outfit_founder', 1)
on conflict (code) do nothing;

-- Starter challenges spanning all 4 types and all 3 difficulty tiers.
insert into public.challenges (title, description, pillar, challenge_type, difficulty, xp_reward) values
  ('Money Quiz Checkpoint', 'A quick knowledge check on budgeting basics.', 'finance', 'knowledge', 1, 50),
  ('Build Your First Budget', 'Create a simple weekly budget for yourself.', 'finance', 'practical', 1, 50),
  ('Design a Business Idea', 'Design a business idea that solves a real problem.', 'entrepreneurship', 'practical', 2, 100),
  ('Map Your Career Pathway', 'Map out a career pathway from your subjects to a job.', 'career', 'practical', 2, 100),
  ('Build a Simple STEM Solution', 'Build a simple solution to a practical STEM problem.', 'digital', 'practical', 2, 100),
  ('Create a 60-Second Video', 'Create a 60-second video about something you care about.', 'leadership', 'creator', 2, 100),
  ('Interview Someone About Their Career', 'Interview someone about their career and share what you learned.', 'career', 'creator', 3, 200),
  ('Identify a Community Problem', 'Identify and describe a real problem in your community.', 'civic', 'community', 3, 200);
