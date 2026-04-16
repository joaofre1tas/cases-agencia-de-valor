-- 001_schema.sql
-- Core schema for admin-only case management.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  agency_name text not null,
  segment text not null,
  published boolean not null default false,
  sort_order int not null default 0,

  -- Card/preview fields
  title text not null,
  description text not null,
  logo_url text,
  avatar_url text,

  -- Case page fields
  cover_url text,
  subtitle text,
  badge_label text,

  challenge_eyebrow text default 'O desafio',
  challenge_heading text,
  challenge_content text,

  solution_eyebrow text default 'A solução',
  solution_heading text,
  solution_content text,

  results_eyebrow text default 'Os resultados',
  results_heading text,
  results_content text,

  -- Testimonials block
  quote_text text,
  quote_author_name text,
  quote_author_role text,
  quote_author_avatar_url text,
  quote_cta_label text,
  quote_cta_url text,

  -- Final CTA
  final_cta_heading text,
  final_cta_body text,
  final_cta_label text default 'Aplicar agora',
  final_cta_url text,

  -- Array of { value, label }
  metrics jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_published_sort_idx on public.cases(published, sort_order);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cases_set_updated_at on public.cases;
create trigger cases_set_updated_at
before update on public.cases
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$ language sql security definer stable;

alter table public.cases enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists cases_select_public on public.cases;
create policy cases_select_public on public.cases
for select using (published = true or public.is_admin());

drop policy if exists cases_all_admin on public.cases;
create policy cases_all_admin on public.cases
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists admin_users_select on public.admin_users;
create policy admin_users_select on public.admin_users
for select using (public.is_admin());
