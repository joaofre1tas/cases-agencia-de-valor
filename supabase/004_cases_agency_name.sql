-- 004_cases_agency_name.sql
-- Adds explicit agency name field used by admin editor.

alter table public.cases
add column if not exists agency_name text;
