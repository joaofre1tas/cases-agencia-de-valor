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
5. (Opcional) `supabase/003_seed_cases.sql`

### Criar usuário admin

1. No Supabase Authentication, crie o usuário (email/senha).
2. Pegue o `id` do usuário.
3. Rode:

```sql
insert into admin_users (id, email, name)
values ('<uuid-do-user>', '<email-do-user>', '<nome>');
```

Sem essa whitelist, o login autentica mas não libera `/admin`.

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
