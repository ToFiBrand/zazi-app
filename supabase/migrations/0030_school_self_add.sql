-- Lets a signing-up student add their own school if it isn't already in
-- the list, instead of being stuck unable to complete signup. Schools are
-- low-sensitivity reference data (name/province/district, already
-- publicly readable) — the only change is who can add a new one.
-- Authenticated-only (not fully anonymous), so additions are at least
-- tied to a real account; admins retain full manage rights via the
-- existing "Admins can manage schools" policy to clean up bad entries.
create policy "Authenticated users can add a school"
  on public.schools for insert
  with check (auth.uid() is not null);
