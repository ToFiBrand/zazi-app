-- Atomic counters callable by any authenticated user, without granting
-- general UPDATE rights on lessons/student_content.
create or replace function public.increment_lesson_views(p_lesson_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.lessons set views = views + 1
  where id = p_lesson_id and status = 'published';
$$;

create or replace function public.increment_content_views(p_content_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.student_content set views = views + 1
  where id = p_content_id and status = 'approved';
$$;

create or replace function public.increment_content_likes(p_content_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.student_content set likes = likes + 1
  where id = p_content_id and status = 'approved';
$$;

grant execute on function public.increment_lesson_views(uuid) to authenticated, anon;
grant execute on function public.increment_content_views(uuid) to authenticated, anon;
grant execute on function public.increment_content_likes(uuid) to authenticated, anon;
