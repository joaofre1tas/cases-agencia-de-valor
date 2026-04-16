-- 007_site_editor_enhancements.sql
-- Seção "Todos os cases", badges múltiplas no rodapé, seções do footer, tipografia responsiva, links em nova guia.

insert into public.site_settings (key, value) values
  ('home.cases.eyebrow', to_jsonb('Todos os cases'::text)),
  ('home.cases.title_html', to_jsonb('<p>Resultados <span class="text-gradient-av">auditáveis</span>, não promessas.</p>'::text)),
  ('home.cases.align', '{"mobile":"left","tablet":"left","desktop":"left"}'::jsonb),
  ('home.cases.typography', '{"eyebrow":{"mobile":"sm","tablet":"sm","desktop":"base"},"title":{"mobile":"3xl","tablet":"3xl","desktop":"4xl"}}'::jsonb),
  ('footer.badges', '[{"label":"+ R$126M em resultados","enabled":true}]'::jsonb),
  ('footer.show_menu_section', 'true'::jsonb),
  ('footer.show_contact_section', 'true'::jsonb),
  ('footer.show_social_section', 'true'::jsonb),
  ('footer.slogan_typography', '{"mobile":"sm","tablet":"sm","desktop":"base"}'::jsonb),
  ('footer.badges_typography', '{"mobile":"xs","tablet":"xs","desktop":"sm"}'::jsonb)
on conflict (key) do nothing;

-- Atualiza links existentes com openInNewTab (idempotente)
update public.site_settings
set value = (
  select jsonb_agg(
    case
      when elem ? 'openInNewTab' then elem
      else elem || jsonb_build_object('openInNewTab', false)
    end
  )
  from jsonb_array_elements(value) as elem
)
where key = 'footer.menu_links'
  and jsonb_typeof(value) = 'array'
  and jsonb_array_length(value) > 0;

update public.site_settings
set value = (
  select jsonb_agg(
    case
      when elem ? 'openInNewTab' then elem
      else elem || jsonb_build_object('openInNewTab', false)
    end
  )
  from jsonb_array_elements(value) as elem
)
where key = 'footer.social'
  and jsonb_typeof(value) = 'array'
  and jsonb_array_length(value) > 0;

update public.site_settings
set value = (
  select jsonb_agg(
    case
      when elem ? 'openInNewTab' then elem
      else elem || jsonb_build_object('openInNewTab', false)
    end
  )
  from jsonb_array_elements(value) as elem
)
where key = 'footer.legal_links'
  and jsonb_typeof(value) = 'array'
  and jsonb_array_length(value) > 0;
