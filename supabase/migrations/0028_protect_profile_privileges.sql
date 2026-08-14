-- Closes a real privilege-escalation gap: "Users can update their own
-- profile" (0002_profiles.sql) is a blanket `using (auth.uid() = id)`
-- policy with no column restriction. Nothing in the app's own UI writes
-- `role`/`contributor_status`/`status` directly — but nothing at the
-- database level stopped a student from calling the REST API themselves
-- with `{"role":"admin"}` and it would have succeeded.
--
-- This can't be a flat "block any change unless admin" rule: two existing,
-- legitimate flows write these columns from a NON-admin auth context —
-- handle_new_user() sets the initial role at signup (an INSERT, not
-- relevant here) and handle_application_submitted() (0008_teacher_
-- applications.sql) sets contributor_status = 'pending' the moment a
-- student applies to become a contributor, before any admin is involved.
-- Only the *approval* step (handle_application_decision(), which only
-- runs when an admin updates teacher_applications) legitimately sets
-- role = 'teacher' or contributor_status = 'approved'/'rejected'.
--
-- So: role is always admin-only to change. contributor_status may be
-- self-set to 'pending' (applying) but never self-set to 'approved' or
-- 'rejected'. status (active/suspended) is always admin-only — nothing
-- in the app writes it today, so this is purely closing the gap before
-- it matters.
--
-- A BEFORE UPDATE trigger, not a WITH CHECK policy, because RLS's
-- WITH CHECK only sees the new row, not the old one — comparing
-- old.role vs new.role requires a trigger. Silently reverting the
-- protected columns to their old values (rather than raising an
-- exception) means a payload that legitimately changes other columns
-- (bio, avatar, etc.) alongside an ignored role/status field still
-- succeeds for everything it's allowed to change.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if new.role is distinct from old.role then
      new.role := old.role;
    end if;
    if new.contributor_status is distinct from old.contributor_status
       and new.contributor_status is distinct from 'pending' then
      new.contributor_status := old.contributor_status;
    end if;
    if new.status is distinct from old.status then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$$;

create trigger protect_profile_privileges_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();
