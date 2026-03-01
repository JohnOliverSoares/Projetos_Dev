# Entregas PWA

Sistema de controle de entregas com **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Supabase Auth** e suporte a **PWA** (manifest + service worker).

## Funcionalidades

- Login por email/senha (Supabase Auth)
- Perfis: `admin`, `vendedor`, `entregador`
- Entregador acessa apenas **Minhas Entregas** (hoje e amanhã)
- Ação rápida para **FINALIZAR** entrega com confirmação (e opcional cancelar)
- Admin/Vendedor: painel com filtros, visão geral e criação de nova entrega
- PWA com `manifest.webmanifest` e `sw.js` para instalação em tela inicial

## 1) Pré-requisitos

- Node.js 20+
- Projeto Supabase criado

## 2) Instalação

```bash
npm install
```

## 3) Variáveis de ambiente

Crie `.env.local` com base em `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4) Banco de dados (Supabase)

1. Abra o SQL Editor do Supabase.
2. Rode o conteúdo de `supabase_schema.sql`.
3. Em **Authentication > Users**, crie usuários de teste.
4. Ajuste o role no `profiles` para cada usuário (`admin`, `vendedor`, `entregador`).

## 5) Rodar localmente

```bash
npm run dev
```

Acesse: `http://localhost:3000/login`

## 6) Scripts disponíveis

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## 7) Deploy na Vercel

1. Suba o projeto no GitHub.
2. Importe na Vercel.
3. Configure as variáveis de ambiente no painel da Vercel.
4. Deploy.

## Rotas

- `/login`
- `/entregas` (entregador)
- `/painel` (admin/vendedor)
- `/nova-entrega` (admin/vendedor)
