-- Student-generated content (posts/videos/stories/challenges/ideas).
-- Everything starts 'pending' and only becomes public once approved —
-- this is the core safeguarding mechanism for a platform used by minors.
create table public.student_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  content_type text not null
    check (content_type in ('post', 'video', 'story', 'challenge', 'idea')),
  pillar text not null
    check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  image_url text,
  video_url text,
  body text,
  author_id uuid not null references public.profiles(id) on delete cascade,
  color text not null default '#FF8A00',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  moderation_note text,
  views int not null default 0,
  likes int not null default 0,
  comments_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.student_content enable row level security;

create policy "Approved content is publicly readable"
  on public.student_content for select
  using (status = 'approved');

create policy "Authors can read their own content"
  on public.student_content for select
  using (auth.uid() = author_id);

create policy "Admins can read all content"
  on public.student_content for select
  using (public.is_admin());

create policy "Students can submit content"
  on public.student_content for insert
  with check (auth.uid() = author_id);

create policy "Admins can moderate content"
  on public.student_content for update
  using (public.is_admin());
