-- 006_site_settings_and_roles.sql
-- Super admin role + public site content (home hero, header CTA, footer).

-- 1) Role on admin whitelist (idempotent)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'admin_users' and column_name = 'role'
  ) then
    alter table public.admin_users
      add column role text not null default 'admin'
      check (role in ('admin', 'super_admin'));
  end if;
end $$;

-- Promote primary account (adjust id if needed)
update public.admin_users
set role = 'super_admin'
where id = '82aa439a-c70f-46e2-8a12-4ecc8f549a2a';

-- 2) RPC: super admin check
create or replace function public.is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'super_admin'
  );
$$ language sql security definer stable;

-- 3) Key-value settings (value is jsonb: string, array, object, etc.)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists site_settings_select_public on public.site_settings;
create policy site_settings_select_public on public.site_settings
for select using (true);

drop policy if exists site_settings_write_super on public.site_settings;
create policy site_settings_write_super on public.site_settings
for all using (public.is_super_admin()) with check (public.is_super_admin());

-- 4) Seed (idempotent)
insert into public.site_settings (key, value) values
  ('home.hero.eyebrow', to_jsonb('Cases · Agência de Valor'::text)),
  ('home.hero.title_html', to_jsonb('<p>Agências reais faturando <span class="text-gradient-av">R$100k+</span> todo mês.</p>'::text)),
  ('home.hero.subtitle_html', to_jsonb('<p>Mais de <span class="text-gradient-av font-semibold">R$126 milhões</span> em resultados gerados. Aqui estão os cases reais de donos que estruturaram o negócio dentro da Mentoria Agência de Valor.</p>'::text)),
  ('home.hero.badges', '[{"label":"+412 calls individuais","enabled":true},{"label":"100% individual","enabled":true}]'::jsonb),
  ('header.cta_label', to_jsonb('Aplicar agora'::text)),
  ('header.cta_url', to_jsonb('#'::text)),
  ('footer.slogan_html', to_jsonb('<p>Mentoria premium para donos de agência que querem estruturar o negócio e faturar <span class="text-gradient-av font-semibold">R$100k todo mês</span>.</p>'::text)),
  ('footer.stat_badge', to_jsonb('+ R$126M em resultados'::text)),
  ('footer.menu_links', '[
    {"label":"Home","href":"/","enabled":true},
    {"label":"Método","href":"#metodo","enabled":true},
    {"label":"Resultados","href":"#resultados","enabled":true},
    {"label":"Mentoria","href":"#mentoria","enabled":true}
  ]'::jsonb),
  ('footer.contact_email', to_jsonb('contato@agenciadevalor.com'::text)),
  ('footer.location', to_jsonb('Brasil · 100% online'::text)),
  ('footer.social', '[
    {"platform":"instagram","label":"Instagram","url":"#","enabled":true},
    {"platform":"linkedin","label":"LinkedIn","url":"#","enabled":true},
    {"platform":"youtube","label":"YouTube","url":"#","enabled":true}
  ]'::jsonb),
  ('footer.copyright', to_jsonb('© 2026 Agência de Valor · AV. Todos os direitos reservados.'::text)),
  ('footer.legal_links', '[
    {"label":"Política de Privacidade","href":"#","enabled":true},
    {"label":"Termos de Uso","href":"#","enabled":true}
  ]'::jsonb)
on conflict (key) do nothing;
