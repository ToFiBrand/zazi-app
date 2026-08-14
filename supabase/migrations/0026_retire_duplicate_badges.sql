-- Fix: 0024's expanded achievement list unintentionally duplicated two
-- badges already seeded in 0022 with identical unlock criteria —
-- 'first_lesson' (superseded by 'first_step') and 'first_creation'
-- (superseded by 'creator'). Both pairs were being granted simultaneously
-- on the same event (confirmed live: completing one lesson earned both
-- "First Lesson Complete" and "First Step" at once).
--
-- Rather than delete the old rows (which would cascade-delete any
-- already-earned profile_badges via the FK), add an `active` flag — same
-- pattern already used by missions/challenges/avatar_items — and stop
-- granting the retired ones going forward. Historical earns are untouched.

alter table public.badges add column active boolean not null default true;

update public.badges set active = false where badge_id in ('first_lesson', 'first_creation');

-- check_and_grant_badges() only considers active badges from here on.
create or replace function public.check_and_grant_badges(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  badge record;
  v_lesson_count int;
  v_contribution_count int;
  v_pillar_variety int;
  v_level int;
  v_streak int;
begin
  select count(*) into v_lesson_count from public.lesson_progress where student_id = p_profile_id and completed = true;
  select count(*) into v_contribution_count from public.contributions where contributor_id = p_profile_id and status = 'published';
  select count(distinct l.pillar) into v_pillar_variety
    from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
    where lp.student_id = p_profile_id and lp.completed = true;
  select current_streak, public.avatar_level_for_xp(points) into v_streak, v_level from public.profiles where id = p_profile_id;

  for badge in
    select * from public.badges b
    where b.active = true
    and not exists (select 1 from public.profile_badges pb where pb.profile_id = p_profile_id and pb.badge_id = b.badge_id)
  loop
    if (
      (badge.criteria->>'kind' = 'lesson_count' and v_lesson_count >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'contribution_count' and v_contribution_count >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'pillar_variety_count' and v_pillar_variety >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'level' and v_level >= (badge.criteria->>'level')::int)
      or (badge.criteria->>'kind' = 'streak' and v_streak >= (badge.criteria->>'count')::int)
      or (badge.criteria->>'kind' = 'pillar_lesson_count' and (badge.criteria->>'count')::int <= (
            select count(*) from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
            where lp.student_id = p_profile_id and lp.completed = true and l.pillar = badge.criteria->>'pillar'
          ))
      or (badge.criteria->>'kind' = 'pillar_challenge_count' and (badge.criteria->>'count')::int <= (
            select count(*) from public.user_challenges uc join public.challenges c on c.id = uc.challenge_id
            where uc.profile_id = p_profile_id and uc.status = 'completed' and c.pillar = badge.criteria->>'pillar'
          ))
    ) then
      insert into public.profile_badges (profile_id, badge_id) values (p_profile_id, badge.badge_id);
      insert into public.notifications (user_id, type, title, body)
        values (p_profile_id, 'badge-earned', 'Badge earned: ' || badge.name, badge.description);
    end if;
  end loop;
end;
$$;
