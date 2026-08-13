-- Schools: reference data, publicly readable (needed for signup), admin-managed.
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,
  district text,
  created_at timestamptz not null default now()
);

alter table public.schools enable row level security;

create policy "Schools are publicly readable"
  on public.schools for select
  using (true);
