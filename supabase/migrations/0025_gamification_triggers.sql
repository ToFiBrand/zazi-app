-- Gamification, XP, Level, Achievement & Streak System — functions & triggers.
--
-- Replaces 0023's `grant_avatar_progress()` with a cleaner split:
--   award_xp()                 — the ONLY place profiles.points changes.
--                                 Idempotent per (profile_id, source_type,
--                                 source_id); this IS the anti-farming
--                                 mechanism. Also detects level-ups and
--                                 delegates unlock-checking.
--   touch_streak()              — the ONLY place streak fields change.
--   check_and_grant_badges()    — re-derives every achievement-relevant
--                                 stat fresh and grants any newly-earned
--                                 badge. Called from award_xp().
--   check_and_grant_avatar_items() — same idea, for avatar_items.
--
-- 0023's two triggers (lesson completion, contribution publish) are
-- rewritten to call these instead of the old grant_avatar_progress().

-- 10-tier level system (was 6 tiers in 0023) — thresholds mirrored in
-- src/data/avatarLevels.js; keep both in sync by hand if either changes.
create or replace function public.avatar_level_for_xp(p_xp int)
returns int
language sql
immutable
as $$
  select case
    when p_xp >= 5000 then 10
    when p_xp >= 3500 then 9
    when p_xp >= 2600 then 8
    when p_xp >= 1900 then 7
    when p_xp >= 1300 then 6
    when p_xp >= 850  then 5
    when p_xp >= 500  then 4
    when p_xp >= 250  then 3
    when p_xp >= 100  then 2
    else 1
  end;
$$;

drop function if exists public.grant_avatar_progress(uuid, int, int, text, int, int);

create or replace function public.check_and_grant_badges(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  badge record;
  v_lesson_count int;
  v_contribution_count int;
  v_pillar_variety int;
  v_level int;
  v_streak int;
begin
  select count(*) into v_lesson_count from public.lesson_progress where student_id = p_profile_id and completed = true;
  select count(*) into v_contribution_count from public.contributions where contributor_id = p_profile_id and status = 'published';
  select count(distinct l.pillar) into v_pillar_variety
    from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
    where lp.student_id = p_profile_id and lp.completed = true;
  select current_streak, public.avatar_level_for_xp(points) into v_streak, v_level from public.profiles where id = p_profile_id;

  for badge in
    select * from public.badges b
    where not exists (select 1 from public.profile_badges pb where pb.profile_id = p_profile_id and pb.badge_id = b.badge_id)
  loop
    if (
      (badge.criteria->>'kind' = 'lesson_count' and v_lesson_count >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'contribution_count' and v_contribution_count >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'pillar_variety_count' and v_pillar_variety >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'level' and v_level >= (badge.criteria->>'level')::int)
      or (badge.criteria->>'kind' = 'streak' and v_streak >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'pillar_lesson_count' and (badge.criteria->>'count')::int <= (
            select count(*) from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
            where lp.student_id = p_profile_id and lp.completed = true and l.pillar = badge.criteria->>'pillar'
          ))
      or (badge.criteria->>'kind' = 'pillar_challenge_count' and (badge.criteria->>'count')::int <= (
            select count(*) from public.user_challenges uc join public.challenges c on c.id = uc.challenge_id
            where uc.profile_id = p_profile_id and uc.status = 'completed' and c.pillar = badge.criteria->>'pillar'
          ))
    ) then
      insert into public.profile_badges (profile_id, badge_id) values (p_profile_id, badge.badge_id);
      insert into public.notifications (user_id, type, title, body)
        values (p_profile_id, 'badge-earned', 'Badge earned: ' || badge.name, badge.description);
    end if;
  end loop;
end;
$$;

create or replace function public.check_and_grant_avatar_items(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
  v_lesson_count int;
  v_contribution_count int;
  v_level int;
begin
  select count(*) into v_lesson_count from public.lesson_progress where student_id = p_profile_id and completed = true;
  select count(*) into v_contribution_count from public.contributions where contributor_id = p_profile_id and status = 'published';
  select public.avatar_level_for_xp(points) into v_level from public.profiles where id = p_profile_id;

  for item in
    select * from public.avatar_items ai
    where not exists (select 1 from public.profile_unlocked_items pui where pui.profile_id = p_profile_id and pui.item_id = ai.item_id)
  loop
    if (
      (item.unlock_type = 'xp_level' and v_level >= (item.unlock_requirement->>'level')::int)
      or (item.unlock_type = 'lesson_count' and v_lesson_count >= (item.unlock_requirement->>'count')::int)
      or (item.unlock_type = 'contribution' and v_contribution_count >= (item.unlock_requirement->>'count')::int)
      or (item.unlock_type = 'pillar_lesson' and (item.unlock_requirement->>'count')::int <= (
            select count(*) from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
            where lp.student_id = p_profile_id and lp.completed = true and l.pillar = item.unlock_requirement->>'pillar'
          ))
    ) then
      insert into public.profile_unlocked_items (profile_id, item_id, source) values (p_profile_id, item.item_id, item.unlock_type);
      insert into public.notifications (user_id, type, title, body)
        values (p_profile_id, 'avatar-unlock', 'New item unlocked!', '"' || item.name || '" is ready to equip.');
    end if;
  end loop;
end;
$$;

-- The single XP entry point. Returns true if XP was actually granted
-- (false if this exact (profile_id, source_type, source_id) already
-- earned XP before — the anti-farming guarantee).
create or replace function public.award_xp(
  p_profile_id uuid,
  p_amount int,
  p_reason text,
  p_source_type text,
  p_source_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_already boolean;
  v_old_xp int;
  v_new_xp int;
  v_old_level int;
  v_new_level int;
  v_level_name text;
begin
  select exists (
    select 1 from public.xp_events
    where profile_id = p_profile_id and source_type = p_source_type
      and source_id is not distinct from p_source_id
  ) into v_already;
  if v_already then return false; end if;

  insert into public.xp_events (profile_id, amount, reason, source_type, source_id)
    values (p_profile_id, p_amount, p_reason, p_source_type, p_source_id);

  select points into v_old_xp from public.profiles where id = p_profile_id;
  v_new_xp := coalesce(v_old_xp, 0) + p_amount;
  update public.profiles set points = v_new_xp where id = p_profile_id;

  v_old_level := public.avatar_level_for_xp(coalesce(v_old_xp, 0));
  v_new_level := public.avatar_level_for_xp(v_new_xp);

  if v_new_level > v_old_level then
    select name into v_level_name from (values
      (1, 'Explorer'), (2, 'Zazi Learner'), (3, 'Future Builder'), (4, 'Creator'), (5, 'Innovator'),
      (6, 'Problem Solver'), (7, 'Entrepreneur'), (8, 'Digital Pioneer'), (9, 'Community Leader'), (10, 'Future Shaper')
    ) as levels(lvl, name) where lvl = v_new_level;
    insert into public.notifications (user_id, type, title, body)
      values (p_profile_id, 'level-up', 'Level up! You''re now a ' || v_level_name, 'Level ' || v_new_level || ' reached — new items may be unlocked.');
  end if;

  perform public.check_and_grant_badges(p_profile_id);
  perform public.check_and_grant_avatar_items(p_profile_id);

  return true;
end;
$$;

-- The single streak entry point. A "meaningful learning action" (lesson,
-- quiz, challenge, mission, contribution) calls this once. Same-day
-- repeats are a no-op — the point is days of meaningful progress, not
-- action count.
create or replace function public.touch_streak(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_last date;
  v_current int;
  v_longest int;
  v_freeze int;
  v_today date := current_date;
  v_new_current int;
  v_notif_type text;
  v_notif_title text;
  v_notif_body text;
begin
  select last_learning_date, current_streak, longest_streak, streak_freeze_available
    into v_last, v_current, v_longest, v_freeze
    from public.profiles where id = p_profile_id;

  if v_last = v_today then
    return;
  elsif v_last = v_today - 1 then
    v_new_current := v_current + 1;
  elsif v_last is null then
    v_new_current := 1;
  elsif v_last = v_today - 2 and v_freeze > 0 then
    v_new_current := v_current + 1;
    v_freeze := v_freeze - 1;
    v_notif_type := 'streak-protected';
    v_notif_title := 'Your streak was protected';
    v_notif_body := 'You missed a day — no worries, your freeze kept it alive.';
  else
    v_new_current := 1;
    if coalesce(v_current, 0) > 1 then
      v_notif_type := 'streak-reset';
      v_notif_title := 'Your new journey starts today';
      v_notif_body := 'Every day is a fresh start. Ready to keep building?';
    end if;
  end if;

  v_longest := greatest(coalesce(v_longest, 0), v_new_current);

  -- Bank one freeze every 7-day milestone, capped at 1 held at a time —
  -- a concrete, cron-free stand-in for "1 per month."
  if v_new_current % 7 = 0 and v_freeze < 1 then
    v_freeze := v_freeze + 1;
  end if;

  update public.profiles set
    current_streak = v_new_current,
    longest_streak = v_longest,
    last_learning_date = v_today,
    streak_freeze_available = v_freeze
    where id = p_profile_id;

  if v_notif_type is not null then
    insert into public.notifications (user_id, type, title, body) values (p_profile_id, v_notif_type, v_notif_title, v_notif_body);
  end if;

  if v_new_current = 3 then
    perform public.award_xp(p_profile_id, 25, 'Maintained a 3-day streak', 'STREAK', '00000000-0000-0000-0000-000000000003');
  elsif v_new_current = 7 then
    perform public.award_xp(p_profile_id, 50, 'Maintained a 7-day streak', 'STREAK', '00000000-0000-0000-0000-000000000007');
  elsif v_new_current = 14 then
    perform public.award_xp(p_profile_id, 100, 'Maintained a 14-day streak', 'STREAK', '00000000-0000-0000-0000-000000000014');
  elsif v_new_current = 30 then
    perform public.award_xp(p_profile_id, 250, 'Maintained a 30-day streak', 'STREAK', '00000000-0000-0000-0000-000000000030');
  end if;

  if v_new_current in (3, 7, 14, 30) then
    insert into public.notifications (user_id, type, title, body)
      values (p_profile_id, 'streak-milestone', v_new_current || '-day streak!', 'Keep the momentum going.');
  end if;
end;
$$;

-- Rewired: lesson completion now goes through award_xp/touch_streak, adds
-- duration-based XP (was a flat +20), and checks pathway (topic)
-- completion for the student's own grade.
create or replace function public.notify_lesson_progress_avatar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pillar text;
  v_duration int;
  v_topic_id uuid;
  v_xp int;
  v_student_grade int;
  v_total_in_pathway int;
  v_completed_in_pathway int;
  v_bonus int;
begin
  if new.completed and (old.completed is distinct from new.completed) then
    select pillar, duration_minutes, topic_id into v_pillar, v_duration, v_topic_id from public.lessons where id = new.lesson_id;
    v_xp := case when coalesce(v_duration, 0) >= 10 then 40 else 20 end;
    perform public.award_xp(new.student_id, v_xp, 'Completed a lesson', 'LESSON', new.lesson_id);
    perform public.touch_streak(new.student_id);

    if v_topic_id is not null then
      select grade into v_student_grade from public.profiles where id = new.student_id;

      select count(*) into v_total_in_pathway
        from public.lessons
        where topic_id = v_topic_id and status = 'published'
          and v_student_grade between grade_min and grade_max;

      select count(*) into v_completed_in_pathway
        from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
        where lp.student_id = new.student_id and lp.completed = true and l.topic_id = v_topic_id
          and l.status = 'published' and v_student_grade between l.grade_min and l.grade_max;

      if v_total_in_pathway > 0 and v_completed_in_pathway >= v_total_in_pathway then
        if public.award_xp(new.student_id, 150, 'Completed a learning pathway', 'PATHWAY', v_topic_id) then
          insert into public.notifications (user_id, type, title, body)
            values (new.student_id, 'pathway-completed', 'Pathway complete! 🎉', 'You finished every lesson in this pathway.');
        end if;
      end if;
    end if;
  end if;

  if new.quiz_completed and (old.quiz_completed is distinct from new.quiz_completed) then
    v_bonus := 0;
    if coalesce(new.quiz_total, 0) > 0 then
      if new.quiz_score::float / new.quiz_total >= 0.8 then
        v_bonus := 10;
      end if;
    end if;
    if public.award_xp(new.student_id, 20 + v_bonus, 'Completed a checkpoint quiz', 'QUIZ', new.lesson_id) then
      insert into public.notifications (user_id, type, title, body)
        values (new.student_id, 'quiz-completed', 'Quiz complete! 🎉', 'You scored ' || new.quiz_score || '/' || new.quiz_total || '.');
    end if;
    perform public.touch_streak(new.student_id);
  end if;

  return new;
end;
$$;

-- Rewired: contribution publish now goes through award_xp/touch_streak.
-- Unchanged: still student-only, still fixes the pre-existing gap where
-- contribution approval fired zero notifications before 0023.
create or replace function public.notify_contribution_avatar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.status = 'published' and new.contributor_role = 'student' then
    insert into public.notifications (user_id, type, title, body)
      values (new.contributor_id, 'contribution-published', 'Your creation is live! 🎉', '"' || new.title || '" is now published on Explore.');

    perform public.award_xp(new.contributor_id, 50, 'Published a contribution', 'CONTRIBUTION', new.id);
    perform public.touch_streak(new.contributor_id);

    -- Fulfils a linked challenge, if this contribution was submitted
    -- against one. Upsert, not update — the student may never have
    -- explicitly "started" the challenge (no user_challenges row yet),
    -- and submitting the work itself should still complete it.
    if new.challenge_id is not null then
      insert into public.user_challenges (profile_id, challenge_id, status, completed_at)
        values (new.contributor_id, new.challenge_id, 'completed', now())
      on conflict (profile_id, challenge_id) do update
        set status = 'completed', completed_at = now()
        where public.user_challenges.status != 'completed';
    end if;
  end if;
  return new;
end;
$$;

-- New: challenge completion.
create or replace function public.notify_challenge_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_xp int;
  v_badge_id text;
  v_avatar_item_id text;
  v_title text;
  v_should_fire boolean;
begin
  -- Fires on UPDATE (normal knowledge-challenge self-completion) AND on
  -- INSERT already carrying status='completed' — the practical/creator/
  -- community fulfilment path in notify_contribution_avatar() upserts a
  -- fresh row straight to 'completed' when the student never explicitly
  -- started the challenge first. OLD is not a valid record on INSERT, so
  -- tg_op is checked *first*, in its own branch — referencing old.status
  -- unconditionally (even behind an `or`) errors on INSERT in plpgsql.
  if tg_op = 'INSERT' then
    v_should_fire := new.status = 'completed';
  else
    v_should_fire := new.status = 'completed' and old.status is distinct from new.status;
  end if;

  if v_should_fire then
    select xp_reward, badge_id, avatar_item_id, title into v_xp, v_badge_id, v_avatar_item_id, v_title
      from public.challenges where id = new.challenge_id;

    perform public.award_xp(new.profile_id, v_xp, 'Completed challenge: ' || v_title, 'CHALLENGE', new.challenge_id);
    perform public.touch_streak(new.profile_id);

    if v_badge_id is not null and not exists (select 1 from public.profile_badges where profile_id = new.profile_id and badge_id = v_badge_id) then
      insert into public.profile_badges (profile_id, badge_id) values (new.profile_id, v_badge_id);
    end if;
    if v_avatar_item_id is not null and not exists (select 1 from public.profile_unlocked_items where profile_id = new.profile_id and item_id = v_avatar_item_id) then
      insert into public.profile_unlocked_items (profile_id, item_id, source) values (new.profile_id, v_avatar_item_id, 'challenge');
    end if;

    insert into public.notifications (user_id, type, title, body)
      values (new.profile_id, 'challenge-completed', 'Challenge complete: ' || v_title, '+' || v_xp || ' XP earned.');
  end if;
  return new;
end;
$$;

create trigger on_user_challenge_completed
  after insert or update on public.user_challenges
  for each row execute function public.notify_challenge_completed();

-- New: mission completion (daily or weekly).
create or replace function public.notify_mission_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_xp int;
  v_badge_id text;
  v_avatar_item_id text;
  v_title text;
begin
  if new.status = 'completed' and (old.status is distinct from new.status) then
    select xp_reward, badge_id, avatar_item_id, title into v_xp, v_badge_id, v_avatar_item_id, v_title
      from public.missions where id = new.mission_id;

    perform public.award_xp(new.profile_id, v_xp, 'Completed mission: ' || v_title, 'MISSION', new.id);
    perform public.touch_streak(new.profile_id);

    if v_badge_id is not null and not exists (select 1 from public.profile_badges where profile_id = new.profile_id and badge_id = v_badge_id) then
      insert into public.profile_badges (profile_id, badge_id) values (new.profile_id, v_badge_id);
    end if;
    if v_avatar_item_id is not null and not exists (select 1 from public.profile_unlocked_items where profile_id = new.profile_id and item_id = v_avatar_item_id) then
      insert into public.profile_unlocked_items (profile_id, item_id, source) values (new.profile_id, v_avatar_item_id, 'mission');
    end if;

    insert into public.notifications (user_id, type, title, body)
      values (new.profile_id, 'mission-completed', 'Mission complete: ' || v_title, '+' || v_xp || ' XP earned.');
  end if;
  return new;
end;
$$;

create trigger on_user_mission_completed
  after update on public.user_missions
  for each row execute function public.notify_mission_completed();

-- Opt-in weekly-XP leaderboard, scoped to one school. `xp_events` itself
-- is self-read-only (RLS) — this SECURITY DEFINER function is the only
-- way to read *other* students' XP, and only ever for profiles that set
-- leaderboard_visible = true, and only this week's total, never lifetime
-- XP (so a newcomer competes on equal footing every Monday).
create or replace function public.get_school_leaderboard(p_school_id uuid)
returns table (profile_id uuid, first_name text, avatar_id text, weekly_xp bigint)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.first_name, p.avatar_id, coalesce(sum(xe.amount), 0) as weekly_xp
  from public.profiles p
  left join public.xp_events xe on xe.profile_id = p.id and xe.created_at >= date_trunc('week', now())
  where p.school_id = p_school_id and p.leaderboard_visible = true
  group by p.id, p.first_name, p.avatar_id
  order by weekly_xp desc
  limit 20;
$$;
