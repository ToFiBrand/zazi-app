-- Guest login: Supabase anonymous auth creates a real auth.users row
-- (is_anonymous = true), so the existing profile trigger just needs to
-- give it a friendlier default name instead of empty strings.
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
    coalesce(nullif(new.raw_user_meta_data->>'first_name', ''), case when new.is_anonymous then 'Guest' else '' end),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    nullif(new.raw_user_meta_data->>'grade', '')::int,
    nullif(new.raw_user_meta_data->>'school_id', '')::uuid
  );
  return new;
end;
$$;
