-- 004_segments.sql
-- Adds segments table used by admin SegmentCombobox.

create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists segments_sort_idx on public.segments(sort_order, name);

alter table public.segments enable row level security;

drop policy if exists segments_select on public.segments;
create policy segments_select on public.segments
for select using (public.is_admin() or true);

drop policy if exists segments_admin_all on public.segments;
create policy segments_admin_all on public.segments
for all using (public.is_admin()) with check (public.is_admin());

insert into public.segments (name, sort_order)
select distinct segment, 0
from public.cases
where segment is not null and btrim(segment) <> ''
on conflict (name) do nothing;
-- 004_segments.sql
-- Normaliza segmentos em tabela própria e libera gestão pelo admin.

create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Segmento fallback usado ao excluir um segmento em uso.
insert into public.segments (name, sort_order)
values ('Sem segmento', 9999)
on conflict (name) do nothing;

-- Seed inicial com os segmentos atuais.
insert into public.segments (name, sort_order)
values
  ('Marketing', 1),
  ('Tecnologia', 2),
  ('Varejo', 3),
  ('RH', 4),
  ('Imobiliário', 5),
  ('Jurídico', 6)
on conflict (name) do nothing;

-- RLS
alter table public.segments enable row level security;

drop policy if exists segments_select_public on public.segments;
create policy segments_select_public on public.segments
for select using (true);

drop policy if exists segments_all_admin on public.segments;
create policy segments_all_admin on public.segments
for all using (public.is_admin()) with check (public.is_admin());
