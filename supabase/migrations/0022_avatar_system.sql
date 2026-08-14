-- Avatar & Profile Character System — schema.
--
-- Deliberately does NOT touch `profiles.avatar_id` or its 'thabo' default.
-- Absence of a row in `avatar_customizations` for a profile means: keep
-- rendering that profile's legacy static avatar exactly as today. This is
-- the entire backward-compatibility contract for the 8 seeded illustration
-- avatars (and every lesson/contribution authored under them) — no
-- migration of existing data is required or performed here.

-- One row per profile that has opened "Create Your Zazi". Each *_id column
-- is a free-text key matching an `avatar_items.item_id` (or, for skin_tone,
-- a palette key in the client-side SKIN_TONES list) — the DB doesn't
-- constrain these to a fixed enum so new parts can be added later purely by
-- adding rows to `avatar_items` and files to the client asset registry,
-- with no migration.
create table public.avatar_customizations (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  avatar_name text,
  base_id text not null,
  skin_tone text not null,
  hair_id text,
  outfit_id text,
  accessory_id text,
  headwear_id text,
  headphones_id text,
  special_item_id text,
  updated_at timestamptz not null default now()
);

alter table public.avatar_customizations enable row level security;

-- Publicly readable for the same reason `profiles` is: other students' and
-- contributors' avatars need to render on Explore/community without a login.
create policy "Avatar customizations are publicly readable"
  on public.avatar_customizations for select
  using (true);

create policy "Users manage their own avatar customization"
  on public.avatar_customizations for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Catalog of every selectable avatar part (including the always-free
-- starter items) — admin/SQL-seeded reference data, not user-writable.
-- Mirrors the client-side AVATAR_PARTS registry (src/data/avatarParts.js)
-- 1:1 by item_id; DB is the source of truth for *unlock state*, the client
-- registry is the source of truth for *asset path / z-order*.
create table public.avatar_items (
  item_id text primary key,
  category text not null check (category in
    ('base', 'hair', 'outfit', 'accessory', 'headwear', 'headphones', 'special')),
  name text not null,
  rarity text not null default 'common' check (rarity in ('common', 'rare', 'legendary')),
  unlock_type text not null default 'free' check (unlock_type in
    ('free', 'xp_level', 'badge', 'pillar_lesson', 'lesson_count', 'contribution')),
  unlock_requirement jsonb,
  sort_order int not null default 0
);

alter table public.avatar_items enable row level security;

create policy "Avatar item catalog is publicly readable"
  on public.avatar_items for select using (true);

-- Which items a profile has unlocked. Insert-only via the trigger functions
-- in 0023 — no client insert policy, same "server decides" convention
-- already used by `notifications`.
create table public.profile_unlocked_items (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null references public.avatar_items(item_id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  source text,
  primary key (profile_id, item_id)
);

alter table public.profile_unlocked_items enable row level security;

create policy "Users can read their own unlocked items"
  on public.profile_unlocked_items for select
  using (auth.uid() = profile_id);

create policy "Admins can read all unlocked items"
  on public.profile_unlocked_items for select
  using (public.is_admin());

-- Badge catalog + earned-badge join, same shape/spirit as avatar_items /
-- profile_unlocked_items above. Upgrades ProfileScreen's previous
-- fully-derived badges (computed on the fly from stats, never a discrete
-- "you just earned this" moment) to real, timestamped, notifiable events.
create table public.badges (
  badge_id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  color text not null,
  criteria jsonb not null
);

alter table public.badges enable row level security;
create policy "Badges are publicly readable" on public.badges for select using (true);

create table public.profile_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null references public.badges(badge_id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

alter table public.profile_badges enable row level security;

create policy "Users can read their own badges"
  on public.profile_badges for select
  using (auth.uid() = profile_id);

create policy "Badges are publicly readable for profile display"
  on public.profile_badges for select
  using (true);

-- Seed: avatar item catalog. item_id values here must match the ids used
-- in src/data/avatarParts.js exactly.
insert into public.avatar_items (item_id, category, name, rarity, unlock_type, unlock_requirement, sort_order) values
  -- bases — always free, not really "rewards", cataloged for uniformity
  ('base_1', 'base', 'Base 1', 'common', 'free', null, 1),
  ('base_2', 'base', 'Base 2', 'common', 'free', null, 2),
  ('base_3', 'base', 'Base 3', 'common', 'free', null, 3),
  ('base_4', 'base', 'Base 4', 'common', 'free', null, 4),
  ('base_5', 'base', 'Base 5', 'common', 'free', null, 5),

  -- hair — self-expression, all starter/free
  ('hair_afro', 'hair', 'Afro', 'common', 'free', null, 1),
  ('hair_fade', 'hair', 'Fade', 'common', 'free', null, 2),
  ('hair_twists', 'hair', 'Twists', 'common', 'free', null, 3),
  ('hair_braids', 'hair', 'Long Braids', 'common', 'free', null, 4),
  ('hair_cornrows', 'hair', 'Cornrows', 'common', 'free', null, 5),
  ('hair_puff', 'hair', 'Curly Puff', 'common', 'free', null, 6),

  -- outfits
  ('outfit_explorer', 'outfit', 'Future Explorer', 'common', 'free', null, 1),
  ('outfit_creative', 'outfit', 'Creative', 'common', 'free', null, 2),
  ('outfit_street', 'outfit', 'Street Future', 'common', 'free', null, 3),
  ('outfit_tech', 'outfit', 'Tech Creator', 'common', 'free', null, 4),
  ('outfit_founder', 'outfit', 'Future Founder', 'rare', 'pillar_lesson', '{"pillar":"entrepreneurship","count":1}', 5),
  ('outfit_creator', 'outfit', 'Creator', 'legendary', 'xp_level', '{"level":4}', 6),

  -- accessories (neck/ear/shoulder — visible at bust scale)
  ('accessory_wristband', 'accessory', 'Digital Wristband', 'common', 'free', null, 1),
  ('accessory_chain', 'accessory', 'Chain', 'common', 'free', null, 2),
  ('accessory_earpiece', 'accessory', 'Smart Earpiece', 'rare', 'xp_level', '{"level":2}', 3),
  ('accessory_pin', 'accessory', 'Circuit Pin', 'rare', 'lesson_count', '{"count":5}', 4),

  -- headwear / glasses
  ('headwear_cap', 'headwear', 'Cap', 'common', 'free', null, 1),
  ('headwear_beanie', 'headwear', 'Beanie', 'common', 'free', null, 2),
  ('headwear_round_glasses', 'headwear', 'Round Glasses', 'common', 'free', null, 3),
  ('headwear_smart_glasses', 'headwear', 'STEM Innovator Glasses', 'rare', 'pillar_lesson', '{"pillar":"digital","count":1}', 4),

  -- headphones
  ('headphones_classic', 'headphones', 'Classic Headphones', 'common', 'free', null, 1),
  ('headphones_neon', 'headphones', 'Creator Headphones', 'rare', 'contribution', '{"count":1}', 2),
  ('headphones_neckband', 'headphones', 'Neckband', 'rare', 'xp_level', '{"level":3}', 3);

-- Seed: badge catalog.
insert into public.badges (badge_id, name, description, icon, color, criteria) values
  ('first_lesson', 'First Lesson Complete', 'Completed your first Zazi lesson.', 'PartyPopper', '#FF8A00', '{"kind":"lesson_count","count":1}'),
  ('five_lessons', 'Career Explorer', 'Completed 5 Zazi lessons.', 'Compass', '#006E68', '{"kind":"lesson_count","count":5}'),
  ('first_creation', 'Zazi Creator', 'Published your first piece of content.', 'Palette', '#0D665F', '{"kind":"contribution_count","count":1}'),
  ('pillar_entrepreneur', 'Future Founder', 'Completed your first Entrepreneurship lesson.', 'Rocket', '#E8603C', '{"kind":"pillar_lesson_count","pillar":"entrepreneurship","count":1}'),
  ('pillar_stem', 'STEM Innovator', 'Completed your first Digital & STEM lesson.', 'Cpu', '#006E68', '{"kind":"pillar_lesson_count","pillar":"digital","count":1}'),
  ('level_4', 'Creator Status', 'Reached Level 4 — Creator.', 'Sparkles', '#F4B84C', '{"kind":"level","level":4}');
