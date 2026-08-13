-- The universal Contribution model: every non-lesson piece of content a
-- student or teacher creates (podcasts, videos, stories, opinions, ideas,
-- creative work, challenge responses, and — for verified teachers —
-- explainers, activities, quizzes, worksheets, insights and masterclasses)
-- lives here, discovered and moderated the same way regardless of format.
--
-- "Structured Lesson" is deliberately NOT one of the content_types below —
-- that's the existing `lessons` table (with topics + quiz questions), which
-- already ships this exact workflow and isn't being duplicated or migrated.
--
-- Student and teacher contributions are NOT the same thing wearing the same
-- clothes: they use different content_type vocabularies, and RLS below
-- enforces that a student can only ever insert a student-shaped row and a
-- verified teacher can only ever insert a teacher-shaped row — that
-- separation is structural, not just a UI convention.
create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid not null references public.profiles(id) on delete cascade,
  contributor_role text not null check (contributor_role in ('student', 'teacher')),
  content_type text not null check (content_type in (
    -- student creator formats
    'podcast', 'video', 'story', 'opinion', 'creative', 'challenge_submission', 'what_i_learned', 'idea',
    -- verified educator formats (excludes structured_lesson — see comment above)
    'video_explainer', 'audio_lesson', 'learning_activity', 'quiz', 'worksheet', 'educational_insight', 'masterclass'
  )),
  title text not null,
  description text,
  body_text text,

  -- media (a given contribution only fills in what its format needs)
  media_url text,
  thumbnail_url text,
  audio_url text,
  video_url text,
  image_url text,

  category text,
  pillar text check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  grade_min int check (grade_min between 7 and 12),
  grade_max int check (grade_max between 7 and 12),

  -- populated only for teacher contributions — mirrors the shape `lessons`
  -- already uses, so a future migration of structured_lesson into this
  -- table (if ever desired) would be a data move, not a schema redesign
  subject text,
  learning_objectives text[],
  teaching_content text,
  activity text,
  knowledge_check jsonb,
  resource_name text,
  resource_content text,

  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'under_review', 'needs_changes', 'approved', 'published', 'rejected', 'archived')),
  moderation_notes text,
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  view_count int not null default 0,
  like_count int not null default 0,
  comment_count int not null default 0,

  check (grade_min is null or grade_max is null or grade_max >= grade_min)
);

create index contributions_contributor_id_idx on public.contributions(contributor_id);
create index contributions_status_idx on public.contributions(status);
create index contributions_pillar_idx on public.contributions(pillar);

alter table public.contributions enable row level security;

create policy "Published contributions are publicly readable"
  on public.contributions for select
  using (status = 'published');

create policy "Contributors can read their own contributions"
  on public.contributions for select
  using (auth.uid() = contributor_id);

create policy "Admins can read all contributions"
  on public.contributions for select
  using (public.is_admin());

-- Students may only ever create student-shaped contributions.
create policy "Students can submit student contributions"
  on public.contributions for insert
  with check (
    auth.uid() = contributor_id
    and contributor_role = 'student'
    and content_type in ('podcast', 'video', 'story', 'opinion', 'creative', 'challenge_submission', 'what_i_learned', 'idea')
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'student')
  );

-- Only verified (contributor_status = 'approved') teachers may create
-- teacher-shaped contributions.
create policy "Verified teachers can submit educator contributions"
  on public.contributions for insert
  with check (
    auth.uid() = contributor_id
    and contributor_role = 'teacher'
    and content_type in ('video_explainer', 'audio_lesson', 'learning_activity', 'quiz', 'worksheet', 'educational_insight', 'masterclass')
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'teacher' and contributor_status = 'approved')
  );

create policy "Contributors can edit their own drafts"
  on public.contributions for update
  using (auth.uid() = contributor_id and status in ('draft', 'needs_changes'));

create policy "Admins can moderate any contribution"
  on public.contributions for update
  using (public.is_admin());

-- Teacher profile fields — subjects/grades taught. Distinct from the
-- student `grade` column, which represents the profile owner's own grade.
alter table public.profiles add column subjects text[];
alter table public.profiles add column teaching_grades int[];

-- Extend the shared moderation log to also audit contribution decisions.
alter table public.moderation_log drop constraint moderation_log_content_type_check;
alter table public.moderation_log add constraint moderation_log_content_type_check
  check (content_type in ('lesson', 'student_content', 'contribution'));

alter table public.moderation_log drop constraint moderation_log_decision_check;
alter table public.moderation_log add constraint moderation_log_decision_check
  check (decision in ('approved', 'rejected', 'needs_changes'));
