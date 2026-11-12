create table if not exists user_carts (
  user_id text primary key,
  lines text not null default '[]',
  updated_at timestamptz not null default now()
);
