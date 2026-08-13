-- Generic updated_at maintenance for tables that track it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

create trigger touch_lessons_updated_at
  before update on public.lessons
  for each row execute function public.touch_updated_at();
