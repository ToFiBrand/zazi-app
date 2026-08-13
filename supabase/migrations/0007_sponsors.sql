-- Sponsors: corporate funders, linked to a profile with role='sponsor'
-- for dashboard access.
create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  logo_url text,
  industry text,
  description text,
  sponsored_pillar text
    check (sponsored_pillar in ('career', 'finance', 'digital', 'entrepreneurship', 'leadership', 'civic')),
  created_at timestamptz not null default now()
);

alter table public.sponsors enable row level security;

create policy "Sponsors are publicly readable"
  on public.sponsors for select
  using (true);

create policy "Admins can manage sponsors"
  on public.sponsors for all
  using (public.is_admin())
  with check (public.is_admin());

alter table public.profiles
  add column sponsor_id uuid references public.sponsors(id);
