# Agência de Valor — Cases + Admin

Frontend em React/Vite com área pública de cases e área administrativa protegida (Supabase Auth + whitelist `admin_users`) para o time interno cadastrar e editar todos os campos dos cases.

## Stack

- React 19 + Vite + TypeScript
- Tailwind + shadcn/ui
- Supabase (`@supabase/supabase-js`)
- React Query (`@tanstack/react-query`)
- React Hook Form + Zod
- Tiptap (editor rico no admin)

## Pré-requisitos

- Node.js 18+
- npm
- Projeto Supabase configurado

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Setup do Supabase

Execute no SQL Editor do Supabase, nesta ordem:

1. `supabase/001_schema.sql`
2. `supabase/002_storage.sql`
3. `supabase/004_add_agency_name.sql`
4. `supabase/005_segments.sql`
5. `supabase/006_site_settings_and_roles.sql` (papéis `super_admin` + conteúdo da home no `site_settings`)
6. `supabase/007_site_editor_enhancements.sql` (seção “Todos os cases”, badges do rodapé, colunas do footer, tipografia responsiva, links em nova guia)
7. `supabase/008_hero_footer_align.sql` (alinhamento do hero e blocos do rodapé por breakpoint)
8. (Opcional) `supabase/003_seed_cases.sql`

### Criar usuário admin

1. No Supabase Authentication, crie o usuário (email/senha).
2. Pegue o `id` do usuário.
3. Rode:

```sql
insert into admin_users (id, email, name)
values ('<uuid-do-user>', '<email-do-user>', '<nome>');
```

Sem essa whitelist, o login autentica mas não libera `/admin`.

### Super admins (editor da home)

Após rodar `006_site_settings_and_roles.sql`, um usuário já é promovido por `id` no script. Para promover **outros** super admins depois que criarem conta no Auth (whitelist em `admin_users` já existente), use e-mail:

```sql
update public.admin_users
set role = 'super_admin'
where email in ('email1@dominio.com', 'email2@dominio.com');
```

Quem for só `admin` continua com acesso aos cases; `super_admin` também acessa `/admin/editor-home`.

## Rodando o projeto

```bash
npm run dev
```

- Site público: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin/login`

## Scripts úteis

```bash
npm run lint
npm run build
npm run preview
```

## Estrutura principal

```txt
src/
  components/admin/   # Guard, layout, editor e campos customizados
  pages/admin/        # Login, dashboard, novo/editar case
  lib/supabase.ts     # Cliente Supabase
  lib/auth.ts         # Sessão/login/checagem de admin
  lib/cases.ts        # CRUD de cases + upload no storage
  lib/markdown.ts     # Sanitização HTML (Tiptap -> público)
supabase/
  001_schema.sql
  002_storage.sql
  003_seed_cases.sql
```
