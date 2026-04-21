-- 009_cases_tabs_content.sql
-- Conteúdos para novas abas da seção de cases:
-- - mentor_bell_prints (prints de "sinos")
-- - testimonial_videos (cards com vídeos)

create table if not exists public.mentor_bell_prints (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonial_videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null,
  headline text not null,
  description text,
  agency_name text not null,
  founder_name text not null,
  founder_avatar_url text,
  segment text not null,
  metrics jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mentor_bell_prints_published_sort_idx
  on public.mentor_bell_prints(published, sort_order);

create index if not exists testimonial_videos_published_sort_idx
  on public.testimonial_videos(published, sort_order);

drop trigger if exists mentor_bell_prints_set_updated_at on public.mentor_bell_prints;
create trigger mentor_bell_prints_set_updated_at
before update on public.mentor_bell_prints
for each row execute function public.set_updated_at();

drop trigger if exists testimonial_videos_set_updated_at on public.testimonial_videos;
create trigger testimonial_videos_set_updated_at
before update on public.testimonial_videos
for each row execute function public.set_updated_at();

alter table public.mentor_bell_prints enable row level security;
alter table public.testimonial_videos enable row level security;

drop policy if exists mentor_bell_prints_select_public on public.mentor_bell_prints;
create policy mentor_bell_prints_select_public on public.mentor_bell_prints
for select using (published = true or public.is_admin());

drop policy if exists mentor_bell_prints_all_admin on public.mentor_bell_prints;
create policy mentor_bell_prints_all_admin on public.mentor_bell_prints
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists testimonial_videos_select_public on public.testimonial_videos;
create policy testimonial_videos_select_public on public.testimonial_videos
for select using (published = true or public.is_admin());

drop policy if exists testimonial_videos_all_admin on public.testimonial_videos;
create policy testimonial_videos_all_admin on public.testimonial_videos
for all using (public.is_admin()) with check (public.is_admin());
