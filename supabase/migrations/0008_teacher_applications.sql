-- Contributor/teacher applications — approving one flips
-- profiles.contributor_status so the applicant can start submitting lessons.
create table public.teacher_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  professional_role text not null,
  organisation text,
  pillar text
    check (pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  qualifications text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.teacher_applications enable row level security;

create policy "Applicants can read their own application"
  on public.teacher_applications for select
  using (auth.uid() = applicant_id);

create policy "Admins can read all applications"
  on public.teacher_applications for select
  using (public.is_admin());

create policy "Users can submit an application"
  on public.teacher_applications for insert
  with check (auth.uid() = applicant_id);

create policy "Admins can decide applications"
  on public.teacher_applications for update
  using (public.is_admin());

-- Keep profiles.contributor_status / role in sync with application decisions.
create or replace function public.handle_application_decision()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.status in ('approved', 'rejected') then
    update public.profiles
      set contributor_status = new.status,
          role = case when new.status = 'approved' then 'teacher' else role end
      where id = new.applicant_id;
  end if;
  return new;
end;
$$;

create trigger on_application_decided
  after update on public.teacher_applications
  for each row execute function public.handle_application_decision();

-- Mark the applicant's profile as pending review as soon as they apply.
create or replace function public.handle_application_submitted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set contributor_status = 'pending' where id = new.applicant_id;
  return new;
end;
$$;

create trigger on_application_submitted
  after insert on public.teacher_applications
  for each row execute function public.handle_application_submitted();
