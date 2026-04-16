-- 008_hero_footer_align.sql
-- Alinhamento responsivo do hero e de cada bloco do rodapé.

insert into public.site_settings (key, value) values
  ('home.hero.align', '{"mobile":"left","tablet":"left","desktop":"left"}'::jsonb),
  (
    'footer.section_alignments',
    '{
      "slogan":{"mobile":"left","tablet":"left","desktop":"left"},
      "badges":{"mobile":"left","tablet":"left","desktop":"left"},
      "menu":{"mobile":"left","tablet":"left","desktop":"left"},
      "contact":{"mobile":"left","tablet":"left","desktop":"left"},
      "social":{"mobile":"left","tablet":"left","desktop":"left"},
      "bottom":{"mobile":"left","tablet":"left","desktop":"left"}
    }'::jsonb
  )
on conflict (key) do nothing;
