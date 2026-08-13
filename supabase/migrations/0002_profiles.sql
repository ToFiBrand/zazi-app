-- Profiles: one row per authenticated user, extends auth.users.
-- Deliberately excludes email/contact info — those live only in auth.users,
-- which is never exposed to other users. Safeguarding for minors (brief §27).
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student'
    check (role in ('student', 'teacher', 'admin', 'sponsor', 'school_admin')),
  first_name text not null default '',
  last_name text not null default '',
  avatar_id text not null default 'thabo',
  grade int check (grade between 7 and 12),
  school_id uuid references public.schools(id),
  bio text,
  points int not null default 0,
  status text not null default 'active' check (status in ('active', 'suspended')),
  contributor_status text not null default 'none'
    check (contributor_status in ('none', 'pending', 'approved', 'rejected')),
  sponsor_company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Safe to expose publicly: no email, no auth info, just display fields
-- needed to show creator/contributor names & avatars across the app.
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Role-check helper as SECURITY DEFINER to avoid RLS recursion when other
-- tables' policies need to ask "is the acting user an admin?".
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, role, grade, school_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    nullif(new.raw_user_meta_data->>'grade', '')::int,
    nullif(new.raw_user_meta_data->>'school_id', '')::uuid
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Now that profiles + is_admin() exist, lock down school writes to admins.
create policy "Admins can manage schools"
  on public.schools for all
  using (public.is_admin())
  with check (public.is_admin());
