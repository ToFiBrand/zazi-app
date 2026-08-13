-- Topics sit between a pillar and its lessons: Pillar → Topic → Lesson.
-- A pillar is a fixed top-level category (6 of them); a topic is a
-- curated subject area within it ("Subject Choices → Career Pathways");
-- a lesson is one piece of structured content inside that topic.
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  pillar text not null
    check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.topics enable row level security;

create policy "Topics are publicly readable"
  on public.topics for select
  using (true);

-- Taxonomy is curated, not crowdsourced — teachers pick from existing
-- topics when authoring a lesson, admins grow the list.
create policy "Admins can manage topics"
  on public.topics for all
  using (public.is_admin())
  with check (public.is_admin());

alter table public.lessons add column topic_id uuid references public.topics(id);
create index lessons_topic_id_idx on public.lessons(topic_id);
