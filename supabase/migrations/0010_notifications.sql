-- In-app notifications. Users can only ever see their own; they're created
-- server-side by triggers below, never inserted directly by other users.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can read their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark their own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can create their own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

-- Notify a student when their lesson completion is recorded.
create or replace function public.notify_lesson_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  lesson_title text;
begin
  if new.completed and (old.completed is distinct from new.completed) then
    select title into lesson_title from public.lessons where id = new.lesson_id;
    insert into public.notifications (user_id, type, title, body)
    values (new.student_id, 'completion', 'Lesson complete! 🎉', 'You finished "' || lesson_title || '".');
  end if;
  return new;
end;
$$;

create trigger on_lesson_progress_notify
  after update on public.lesson_progress
  for each row execute function public.notify_lesson_completed();

-- Notify the author when their submission is moderated.
create or replace function public.notify_content_moderated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.status in ('approved', 'rejected') then
    insert into public.notifications (user_id, type, title, body)
    values (
      new.author_id,
      case when new.status = 'approved' then 'approved' else 'rejected' end,
      case when new.status = 'approved' then 'Submission approved ✅' else 'Submission needs changes' end,
      case when new.status = 'approved'
        then '"' || new.title || '" is now live on Explore.'
        else '"' || new.title || '" wasn''t approved. ' || coalesce(new.moderation_note, 'Check moderation notes.')
      end
    );
  end if;
  return new;
end;
$$;

create trigger on_student_content_notify
  after update on public.student_content
  for each row execute function public.notify_content_moderated();

-- Notify the contributor when their lesson is published/rejected.
create or replace function public.notify_lesson_moderated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.status in ('published', 'rejected') and new.contributor_id is not null then
    insert into public.notifications (user_id, type, title, body)
    values (
      new.contributor_id,
      case when new.status = 'published' then 'lesson-approved' else 'lesson-rejected' end,
      case when new.status = 'published' then 'Your lesson was approved 🎉' else 'Lesson needs revisions' end,
      case when new.status = 'published'
        then '"' || new.title || '" is now published to learners.'
        else '"' || new.title || '" was sent back for changes.'
      end
    );
  end if;
  return new;
end;
$$;

create trigger on_lesson_status_notify
  after update on public.lessons
  for each row execute function public.notify_lesson_moderated();
