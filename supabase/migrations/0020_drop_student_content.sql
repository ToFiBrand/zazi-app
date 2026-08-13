-- student_content is superseded by the universal `contributions` table
-- (0019_contributions.sql). Every screen that used to read/write it
-- (CreateContentScreen, CreateSubmissionScreen, ExploreScreen,
-- ContentViewScreen, ProfileScreen, AdminDashboard) has been migrated.
-- `comments` still pointed at it (not yet wired to any real UI — both
-- LessonDetailScreen and ContentViewScreen currently render mock replies),
-- so it's repointed at `contributions` here rather than left dangling.
drop trigger on_comment_created on public.comments;
drop function public.handle_new_comment();

-- Dropping student_content_id implicitly drops comments_check (the CHECK
-- constraint referencing it) too — no explicit DROP CONSTRAINT needed.
alter table public.comments drop column student_content_id;
alter table public.comments add column contribution_id uuid references public.contributions(id) on delete cascade;

alter table public.comments add constraint comments_check check (
  (lesson_id is not null and contribution_id is null)
  or (lesson_id is null and contribution_id is not null)
);

create or replace function public.handle_new_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.contribution_id is not null then
    update public.contributions
      set comment_count = comment_count + 1
      where id = new.contribution_id;
  end if;
  return new;
end;
$$;

create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.handle_new_comment();

-- Table was empty at drop time — no data migration was needed.
drop table public.student_content;
