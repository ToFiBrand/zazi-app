-- Expands lessons from "resource + activity" stubs into full structured
-- content: a hook, a teaching body (with SA-relevant examples folded in),
-- takeaways, a downloadable resource with real content, and authoring-only
-- production notes (video script, visual direction) that aren't rendered
-- to students yet but give a future content/video team a real starting point.
alter table public.lessons
  add column hook text,
  add column content_body text,
  add column key_takeaways text[] not null default '{}',
  add column resource_content text,
  add column video_script text,
  add column visual_notes text,
  add column completion_criteria text,
  add column cover_image_url text;

-- Checkpoint quizzes: a handful of questions per lesson, admin/teacher
-- authored, rendered client-side. Not gated on completion yet — see
-- completion_criteria for the descriptive standard a future gate can enforce.
create table public.lesson_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  question text not null,
  options text[] not null,
  correct_index int not null check (correct_index >= 0),
  sort_order int not null default 0
);

alter table public.lesson_quiz_questions enable row level security;

create policy "Quiz questions are publicly readable"
  on public.lesson_quiz_questions for select
  using (true);

create policy "Admins can manage quiz questions"
  on public.lesson_quiz_questions for all
  using (public.is_admin())
  with check (public.is_admin());

-- Onboarding interests, collected in InterestsScreen, feed the "Recommended
-- for you" ranking on Home. Nullable — guests and skipped-onboarding
-- students just fall back to grade-only recommendations.
alter table public.profiles add column interests text[];
