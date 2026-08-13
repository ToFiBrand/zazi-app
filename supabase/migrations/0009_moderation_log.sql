-- Audit trail of every moderation decision, admin-only.
create table public.moderation_log (
  id uuid primary key default gen_random_uuid(),
  moderator_id uuid not null references public.profiles(id),
  content_type text not null check (content_type in ('lesson', 'student_content')),
  content_id uuid not null,
  decision text not null check (decision in ('approved', 'rejected')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.moderation_log enable row level security;

create policy "Admins can read the moderation log"
  on public.moderation_log for select
  using (public.is_admin());

create policy "Admins can write to the moderation log"
  on public.moderation_log for insert
  with check (public.is_admin() and auth.uid() = moderator_id);
