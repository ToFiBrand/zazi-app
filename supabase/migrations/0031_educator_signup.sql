-- Closes a self-elevation gap at signup: handle_new_user() previously
-- trusted `role` straight out of raw_user_meta_data, which any caller can
-- set via the public anon-key signUp() call (bypassing the app's own UI
-- entirely). Every new profile now always starts as 'student' regardless
-- of what's passed — becoming 'teacher'/'admin' only ever happens via an
-- admin decision (directly, or through the application-approval trigger
-- below, which is itself admin-gated by RLS on teacher_applications).
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
    'student',
    nullif(new.raw_user_meta_data->>'grade', '')::int,
    nullif(new.raw_user_meta_data->>'school_id', '')::uuid
  );
  return new;
end;
$$;

-- Let admin decisions on educator applications show up in the same audit
-- trail as lesson/contribution moderation.
alter table public.moderation_log drop constraint moderation_log_content_type_check;
alter table public.moderation_log add constraint moderation_log_content_type_check
  check (content_type in ('lesson', 'student_content', 'contribution', 'application'));
