-- 004_add_agency_name.sql
-- Migration for existing projects that already created public.cases
-- before agency_name existed.

alter table public.cases
add column if not exists agency_name text;

update public.cases
set agency_name = coalesce(nullif(agency_name, ''), title)
where agency_name is null or agency_name = '';

alter table public.cases
alter column agency_name set not null;
