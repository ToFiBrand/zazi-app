-- Avatar & Profile Character System — XP / unlock / badge triggers.
--
-- `profiles.points` is reused as the XP counter (it already existed,
-- defaulted to 0, and was never incremented anywhere before this). Avatar
-- level is a pure function of XP, computed here AND in
-- src/data/avatarLevels.js — the two threshold tables must be kept in sync
-- by hand if either changes; there are only 6 tiers so this is a small,
-- deliberate duplication rather than a shared source of truth, consistent
-- with this migration's XP/level constants living in exactly one function.

create or replace function public.avatar_level_for_xp(p_xp int)
returns int
language sql
immutable
as $$
  select case
    when p_xp >= 1500 then 6
    when p_xp >= 1000 then 5
    when p_xp >= 600  then 4
    when p_xp >= 300  then 3
    when p_xp >= 100  then 2
    else 1
  end;
$$;

-- Shared grant logic: awards XP, checks for a level-up, and grants any
-- avatar_items / badges whose unlock condition is now satisfied. Called
-- from the two trigger functions below — one per real, existing student
-- action (lesson completion, contribution publish). Never called directly
-- by client code; both call sites are server-side triggers.
create or replace function public.grant_avatar_progress(
  p_profile_id uuid,
  p_xp_delta int,
  p_lesson_count int default null,
  p_pillar text default null,
  p_pillar_lesson_count int default null,
  p_contribution_count int default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_xp int;
  v_new_xp int;
  v_old_level int;
  v_new_level int;
  v_level_name text;
  item record;
  badge record;
begin
  select points into v_old_xp from public.profiles where id = p_profile_id;
  v_new_xp := coalesce(v_old_xp, 0) + p_xp_delta;
  update public.profiles set points = v_new_xp where id = p_profile_id;

  v_old_level := public.avatar_level_for_xp(coalesce(v_old_xp, 0));
  v_new_level := public.avatar_level_for_xp(v_new_xp);

  if v_new_level > v_old_level then
    v_level_name := case v_new_level
      when 2 then 'Zazi Learner' when 3 then 'Future Builder' when 4 then 'Creator'
      when 5 then 'Innovator' when 6 then 'Future Leader' else 'New Explorer' end;
    insert into public.notifications (user_id, type, title, body)
    values (p_profile_id, 'level-up', 'Level up! You''re now a ' || v_level_name, 'Level ' || v_new_level || ' reached — new items may be unlocked.');
  end if;

  for item in
    select * from public.avatar_items ai
    where not exists (
      select 1 from public.profile_unlocked_items pui
      where pui.profile_id = p_profile_id and pui.item_id = ai.item_id
    )
    and (
      (ai.unlock_type = 'xp_level' and (ai.unlock_requirement->>'level')::int <= v_new_level)
      or (ai.unlock_type = 'lesson_count' and p_lesson_count is not null and (ai.unlock_requirement->>'count')::int <= p_lesson_count)
      or (ai.unlock_type = 'pillar_lesson' and p_pillar is not null and ai.unlock_requirement->>'pillar' = p_pillar and p_pillar_lesson_count is not null and (ai.unlock_requirement->>'count')::int <= p_pillar_lesson_count)
      or (ai.unlock_type = 'contribution' and p_contribution_count is not null and (ai.unlock_requirement->>'count')::int <= p_contribution_count)
    )
  loop
    insert into public.profile_unlocked_items (profile_id, item_id, source) values (p_profile_id, item.item_id, item.unlock_type);
    insert into public.notifications (user_id, type, title, body)
    values (p_profile_id, 'avatar-unlock', 'New item unlocked!', '"' || item.name || '" is ready to equip.');
  end loop;

  for badge in
    select * from public.badges b
    where not exists (
      select 1 from public.profile_badges pb
      where pb.profile_id = p_profile_id and pb.badge_id = b.badge_id
    )
    and (
      (b.criteria->>'kind' = 'lesson_count' and p_lesson_count is not null and (b.criteria->>'count')::int <= p_lesson_count)
      or (b.criteria->>'kind' = 'pillar_lesson_count' and p_pillar is not null and b.criteria->>'pillar' = p_pillar and p_pillar_lesson_count is not null and (b.criteria->>'count')::int <= p_pillar_lesson_count)
      or (b.criteria->>'kind' = 'contribution_count' and p_contribution_count is not null and (b.criteria->>'count')::int <= p_contribution_count)
      or (b.criteria->>'kind' = 'level' and (b.criteria->>'level')::int <= v_new_level)
    )
  loop
    insert into public.profile_badges (profile_id, badge_id) values (p_profile_id, badge.badge_id);
    insert into public.notifications (user_id, type, title, body)
    values (p_profile_id, 'badge-earned', 'Badge earned: ' || badge.name, badge.description);
  end loop;
end;
$$;

-- Hook 1: lesson completion (real, existing action — AppContext.jsx completeLesson).
create or replace function public.notify_lesson_progress_avatar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pillar text;
  v_lesson_count int;
  v_pillar_count int;
begin
  if new.completed and (old.completed is distinct from new.completed) then
    select pillar into v_pillar from public.lessons where id = new.lesson_id;

    select count(*) into v_lesson_count
    from public.lesson_progress where student_id = new.student_id and completed = true;

    select count(*) into v_pillar_count
    from public.lesson_progress lp join public.lessons l on l.id = lp.lesson_id
    where lp.student_id = new.student_id and lp.completed = true and l.pillar = v_pillar;

    perform public.grant_avatar_progress(new.student_id, 20, v_lesson_count, v_pillar, v_pillar_count, null);
  end if;
  return new;
end;
$$;

create trigger on_lesson_progress_avatar
  after update on public.lesson_progress
  for each row execute function public.notify_lesson_progress_avatar();

-- Hook 2: contribution published (real, existing action — AppContext.jsx
-- decideContribution). Student contributions only — avatar progression is
-- a learner-facing system; teacher contributor accounts don't participate.
-- This also fixes a latent gap: contribution approval fired zero
-- notifications before this migration (the old student_content-era trigger
-- was never re-created after the 0019/0020 migration to `contributions`).
create or replace function public.notify_contribution_avatar()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_contribution_count int;
begin
  if new.status is distinct from old.status and new.status = 'published' and new.contributor_role = 'student' then
    insert into public.notifications (user_id, type, title, body)
    values (new.contributor_id, 'contribution-published', 'Your creation is live! 🎉', '"' || new.title || '" is now published on Explore.');

    select count(*) into v_contribution_count
    from public.contributions where contributor_id = new.contributor_id and status = 'published';

    perform public.grant_avatar_progress(new.contributor_id, 50, null, null, null, v_contribution_count);
  end if;
  return new;
end;
$$;

create trigger on_contribution_status_avatar
  after update on public.contributions
  for each row execute function public.notify_contribution_avatar();
