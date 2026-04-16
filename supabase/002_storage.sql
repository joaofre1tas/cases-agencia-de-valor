-- 002_storage.sql
-- Storage bucket and policies for case assets.

insert into storage.buckets (id, name, public)
values ('case-assets', 'case-assets', true)
on conflict (id) do nothing;

drop policy if exists "case-assets public read" on storage.objects;
create policy "case-assets public read" on storage.objects
for select using (bucket_id = 'case-assets');

drop policy if exists "case-assets admin write" on storage.objects;
create policy "case-assets admin write" on storage.objects
for insert with check (bucket_id = 'case-assets' and public.is_admin());

drop policy if exists "case-assets admin update" on storage.objects;
create policy "case-assets admin update" on storage.objects
for update using (bucket_id = 'case-assets' and public.is_admin());

drop policy if exists "case-assets admin delete" on storage.objects;
create policy "case-assets admin delete" on storage.objects
for delete using (bucket_id = 'case-assets' and public.is_admin());
