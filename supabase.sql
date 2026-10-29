-- Supabase SQL Editor에 붙여넣고 Run
create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  item_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_id)
);

alter table public.favorites enable row level security;

create policy "own favorites select" on public.favorites
  for select using (auth.uid() = user_id);
create policy "own favorites insert" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "own favorites delete" on public.favorites
  for delete using (auth.uid() = user_id);
