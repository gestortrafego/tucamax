
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  plan_name text not null default 'Free',
  credits_total integer not null default 10000,
  credits_used integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles: self select" on public.profiles for select using (auth.uid() = id);
create policy "Profiles: self update" on public.profiles for update using (auth.uid() = id);
create policy "Profiles: self insert" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'company_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'ativo',
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "Projects: owner all" on public.projects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.projects(user_id);

-- Companies (shared catalog, readable by any authenticated user)
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  cnpj text unique not null,
  razao_social text not null,
  nome_fantasia text,
  situacao text,
  cnae text,
  segmento text,
  cidade text,
  estado text,
  telefone text,
  email text,
  site text,
  data_abertura date,
  porte text,
  created_at timestamptz not null default now()
);
alter table public.companies enable row level security;
create policy "Companies: read for authenticated" on public.companies for select to authenticated using (true);

-- Project <-> Company
create table public.project_companies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(project_id, company_id)
);
alter table public.project_companies enable row level security;
create policy "ProjectCompanies: owner all" on public.project_companies for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));
create index on public.project_companies(project_id);
