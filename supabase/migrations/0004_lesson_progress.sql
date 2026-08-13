-- Per-student lesson progress. Private to the student (and admins/teachers
-- via aggregate views, added later if needed).
create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  started boolean not null default false,
  completed boolean not null default false,
  started_at timestamptz,
  completed_at timestamptz,
  watch_time_seconds int not null default 0,
  unique (student_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Students can read their own progress"
  on public.lesson_progress for select
  using (auth.uid() = student_id);

create policy "Students can insert their own progress"
  on public.lesson_progress for insert
  with check (auth.uid() = student_id);

create policy "Students can update their own progress"
  on public.lesson_progress for update
  using (auth.uid() = student_id);

create policy "Admins can read all progress"
  on public.lesson_progress for select
  using (public.is_admin());

-- Keep lessons.completions in sync when a student completes a lesson.
create or replace function public.handle_lesson_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.completed and (old.completed is distinct from new.completed) then
    update public.lessons set completions = completions + 1 where id = new.lesson_id;
  end if;
  return new;
end;
$$;

create trigger on_lesson_progress_completed
  after update on public.lesson_progress
  for each row execute function public.handle_lesson_completed();
