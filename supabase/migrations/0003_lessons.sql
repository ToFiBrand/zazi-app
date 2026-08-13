-- Lessons: the core learning content, one per pillar/grade-band, contributed
-- by teachers and moderated before publishing.
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  pillar text not null
    check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  grade_min int not null check (grade_min between 7 and 12),
  grade_max int not null check (grade_max between 7 and 12),
  objectives text[] not null default '{}',
  video_url text,
  resource_name text,
  resource_type text default 'PDF',
  activity text,
  discussion_question text,
  duration_minutes int not null default 10,
  contributor_id uuid references public.profiles(id),
  contributor_name text not null,
  contributor_role text,
  avatar_id text not null default 'thabo',
  color text not null default '#FF8A00',
  sponsor text,
  status text not null default 'draft'
    check (status in ('draft', 'pending', 'published', 'rejected')),
  views int not null default 0,
  completions int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (grade_max >= grade_min)
);

alter table public.lessons enable row level security;

create policy "Published lessons are publicly readable"
  on public.lessons for select
  using (status = 'published');

create policy "Contributors can read their own lessons"
  on public.lessons for select
  using (auth.uid() = contributor_id);

create policy "Admins can read all lessons"
  on public.lessons for select
  using (public.is_admin());

create policy "Teachers can submit lessons"
  on public.lessons for insert
  with check (
    auth.uid() = contributor_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher' and contributor_status = 'approved'
    )
  );

create policy "Contributors can update their own unpublished lessons"
  on public.lessons for update
  using (auth.uid() = contributor_id and status in ('draft', 'pending'));

create policy "Admins can update any lesson"
  on public.lessons for update
  using (public.is_admin());
