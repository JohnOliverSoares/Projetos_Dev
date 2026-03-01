-- Extensões
create extension if not exists "uuid-ossp";

-- Tipos
create type public.user_role as enum ('admin', 'vendedor', 'entregador');
create type public.delivery_status as enum ('AGENDADO', 'FINALIZADO', 'CANCELADO');

-- Tabela de perfis
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role public.user_role not null default 'entregador'
);

-- Tabela de entregas
create table if not exists public.deliveries (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  time time not null,
  location text not null,
  customer_name text not null,
  customer_phone text not null,
  notes text,
  status public.delivery_status not null default 'AGENDADO',
  assigned_to uuid not null references public.profiles(id),
  created_by uuid not null references public.profiles(id),
  finished_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger deliveries_updated_at
before update on public.deliveries
for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.deliveries enable row level security;

-- Profiles policies
create policy "profiles_self_select"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_admin_select_all"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles_self_update"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Deliveries policies
create policy "deliveries_entregador_select_own"
  on public.deliveries
  for select
  using (assigned_to = auth.uid());

create policy "deliveries_entregador_update_own"
  on public.deliveries
  for update
  using (assigned_to = auth.uid())
  with check (assigned_to = auth.uid());

create policy "deliveries_vendedor_select"
  on public.deliveries
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('vendedor', 'admin')
    )
  );

create policy "deliveries_vendedor_insert"
  on public.deliveries
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('vendedor', 'admin')
    )
  );

create policy "deliveries_vendedor_update"
  on public.deliveries
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('vendedor', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('vendedor', 'admin')
    )
  );

create policy "deliveries_admin_delete"
  on public.deliveries
  for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Opcional: inserir perfil automaticamente ao registrar novo usuário (role padrão entregador)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 'entregador')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
