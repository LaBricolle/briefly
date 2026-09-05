-- Schéma de base pour Briefly (MVP)
-- À exécuter dans l'éditeur SQL de ton projet Supabase.

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  last_notified_at timestamptz
);

create table if not exists digests (
  id uuid primary key default gen_random_uuid(),
  digest_date date not null unique,
  stories jsonb not null, -- tableau de { title, summary, sources: [{name, url}] }
  created_at timestamptz not null default now()
);

-- Index pour retrouver vite le digest du jour / l'historique
create index if not exists digests_date_idx on digests (digest_date desc);
