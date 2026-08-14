-- Fix a real bug in 0028's protection trigger: it also silently reverted
-- edits made through the Supabase Studio Table Editor / SQL Editor, not
-- just the app's own client calls. That made it impossible to ever
-- create the *first* admin — a chicken-and-egg problem, since the only
-- way to grant admin was already blocked by the thing meant to stop
-- non-admins granting it to themselves.
--
-- Why this happened: 0028's trigger runs on every UPDATE to `profiles`,
-- from any connection. A normal app request (even before login) carries
-- a JWT, so `auth.uid()` is either the caller's own id or null-but-
-- rejected-by-RLS-first (RLS's `using (auth.uid() = id)` can never be
-- satisfied by a null uid, so an anonymous request never even reaches
-- the trigger with a row to update). But the Studio Table Editor/SQL
-- Editor connects as the Postgres owner role directly — no Supabase Auth
-- JWT at all — so `auth.uid()` is null there too, except RLS doesn't
-- apply to that connection in the first place, so the trigger still
-- runs, sees `is_admin()` = false (nobody's profile has id = null), and
-- reverts the edit anyway.
--
-- Fix: only enforce the protection when there IS an authenticated,
-- non-admin caller (`auth.uid() is not null and not is_admin()`). A null
-- `auth.uid()` combined with the update actually reaching this trigger
-- can only mean RLS was bypassed by a privileged connection (Studio,
-- service role, a migration) — never an anonymous API caller, since RLS
-- itself already stops those before the trigger fires.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
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
