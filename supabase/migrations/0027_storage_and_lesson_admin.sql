-- Storage buckets + RLS, and a real-bug fix: admins could not insert
-- lessons at all (0003_lessons.sql's insert policy is teacher-only).
--
-- Two buckets, split by who writes to them:
--   lesson-media        — admin-only write (cover images, resource files,
--                          lesson video). Public read.
--   contribution-media   — write scoped to the uploader's own folder
--                          (student/teacher submission media). Public read.
-- Both public-read because published content in this app is already
-- readable without auth (see e.g. "Published lessons are publicly
-- readable" in 0003_lessons.sql) — storage should behave the same way.

insert into storage.buckets (id, name, public, file_size_limit)
values ('lesson-media', 'lesson-media', true, 209715200) -- 200MB ceiling (covers video); finer per-type limits enforced client-side
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('contribution-media', 'contribution-media', true, 209715200)
on conflict (id) do nothing;

-- `resource_content` (0017_rich_lesson_content.sql) holds the resource's
-- text — there was never a column for an actual uploaded file behind it.
alter table public.lessons add column resource_file_url text;

create policy "Public read access to lesson-media"
  on storage.objects for select
  using (bucket_id = 'lesson-media');

create policy "Admins can upload lesson-media"
  on storage.objects for insert
  with check (bucket_id = 'lesson-media' and public.is_admin());

create policy "Admins can update lesson-media"
  on storage.objects for update
  using (bucket_id = 'lesson-media' and public.is_admin());

create policy "Admins can delete lesson-media"
  on storage.objects for delete
  using (bucket_id = 'lesson-media' and public.is_admin());

create policy "Public read access to contribution-media"
  on storage.objects for select
  using (bucket_id = 'contribution-media');

-- Path convention: {auth.uid()}/{uuid}-{filename} — the folder segment IS
-- the ownership check, same "you can only touch your own thing" pattern
-- used by every row-level policy elsewhere in this schema.
create policy "Users can upload to their own contribution-media folder"
  on storage.objects for insert
  with check (
    bucket_id = 'contribution-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own contribution-media files"
  on storage.objects for update
  using (
    bucket_id = 'contribution-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own contribution-media files"
  on storage.objects for delete
  using (
    bucket_id = 'contribution-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- The actual bug: admins had no way to insert a lesson row at all.
create policy "Admins can insert lessons"
  on public.lessons for insert
  with check (public.is_admin());
