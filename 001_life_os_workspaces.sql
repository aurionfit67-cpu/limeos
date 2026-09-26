create table if not exists public.life_os_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.life_os_workspaces enable row level security;

drop policy if exists "Users can read their own Life OS workspace" on public.life_os_workspaces;
create policy "Users can read their own Life OS workspace"
  on public.life_os_workspaces for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own Life OS workspace" on public.life_os_workspaces;
create policy "Users can insert their own Life OS workspace"
  on public.life_os_workspaces for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own Life OS workspace" on public.life_os_workspaces;
create policy "Users can update their own Life OS workspace"
  on public.life_os_workspaces for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
