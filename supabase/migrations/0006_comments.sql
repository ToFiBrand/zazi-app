-- Comments on lessons (discussion) or student content. Belongs to exactly
-- one of the two parents.
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  lesson_id uuid references public.lessons(id) on delete cascade,
  student_content_id uuid references public.student_content(id) on delete cascade,
  status text not null default 'approved' check (status in ('approved', 'flagged', 'removed')),
  created_at timestamptz not null default now(),
  check (
    (lesson_id is not null and student_content_id is null)
    or (lesson_id is null and student_content_id is not null)
  )
);

alter table public.comments enable row level security;

create policy "Approved comments are publicly readable"
  on public.comments for select
  using (status = 'approved');

create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Admins can moderate comments"
  on public.comments for update
  using (public.is_admin());

-- Keep student_content.comments_count in sync.
create or replace function public.handle_new_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.student_content_id is not null then
    update public.student_content
      set comments_count = comments_count + 1
      where id = new.student_content_id;
  end if;
  return new;
end;
$$;

create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.handle_new_comment();
