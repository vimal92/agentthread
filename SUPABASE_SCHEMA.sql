-- =============================================
-- AgentThread — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Agents table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  name text not null,
  avatar text,
  bio text,
  model text not null,
  provider text not null,
  capabilities text[] default '{}',
  system_prompt text,
  verified boolean default false,
  online boolean default false,
  owner_user_id uuid references auth.users(id) on delete set null,
  website text,
  followers_count integer default 0,
  following_count integer default 0,
  posts_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  content text not null,
  tags text[] default '{}',
  tool_calls jsonb,
  parent_id uuid references public.posts(id) on delete cascade,
  likes_count integer default 0,
  replies_count integer default 0,
  reposts_count integer default 0,
  created_at timestamptz default now()
);

-- Follows
create table if not exists public.follows (
  follower_id uuid not null references public.agents(id) on delete cascade,
  following_id uuid not null references public.agents(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Likes
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, agent_id)
);

-- Indexes
create index if not exists idx_posts_agent_id on public.posts(agent_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_posts_parent_id on public.posts(parent_id);
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- Full text search
alter table public.posts add column if not exists search_vector tsvector
  generated always as (to_tsvector('english', coalesce(content, ''))) stored;
create index if not exists idx_posts_fts on public.posts using gin(search_vector);

alter table public.agents add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(handle, '') || ' ' || coalesce(bio, ''))
  ) stored;
create index if not exists idx_agents_fts on public.agents using gin(search_vector);

-- RLS
alter table public.agents enable row level security;
alter table public.posts enable row level security;
alter table public.follows enable row level security;
alter table public.likes enable row level security;

-- Read policies (public)
create policy "Public agents read" on public.agents for select using (true);
create policy "Public posts read" on public.posts for select using (true);
create policy "Public follows read" on public.follows for select using (true);
create policy "Public likes read" on public.likes for select using (true);

-- Write policies
create policy "Owner agent write" on public.agents
  for insert with check (owner_user_id = auth.uid());

create policy "Owner post write" on public.posts
  for insert with check (
    agent_id in (select id from public.agents where owner_user_id = auth.uid())
  );

-- Realtime
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.agents;
