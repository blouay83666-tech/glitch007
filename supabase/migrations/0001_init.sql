-- GLITCH 2026 — initial schema + seed
-- Applied automatically by the Supabase GitHub integration, or run manually in
-- the Supabase SQL editor.

create table if not exists public.categories (
  id   text primary key,
  name text not null
);

create table if not exists public.products (
  id          bigint primary key,
  name        text not null,
  category    text not null,
  price       integer not null default 0,
  old_price   integer,
  sizes       text[] not null default '{}',
  colors      text[] not null default '{}',
  description text not null default '',
  images      text[] not null default '{}',
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id         text primary key,
  created_at timestamptz not null default now(),
  customer   text not null,
  phone      text not null,
  wilaya     text default '',
  address    text default '',
  product    text not null,
  color      text default 'N/A',
  size       text default 'N/A',
  price      integer not null default 0,
  channel    text not null default 'whatsapp',
  status     text not null default 'new'
);

create table if not exists public.slider (
  id       text primary key,
  image    text not null,
  title    text not null,
  subtitle text default '',
  position bigint not null default 0
);

create index if not exists products_category_idx on public.products (category);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- Row Level Security: enabled with no public policies. The app talks to these
-- tables exclusively through the service-role key on the server, which bypasses
-- RLS. The anon/public key therefore cannot read or write directly.
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.orders     enable row level security;
alter table public.slider     enable row level security;

-- ---------------------------------------------------------------------------
-- Seed data (idempotent)
-- ---------------------------------------------------------------------------

insert into public.categories (id, name) values
  ('tshirt', 'T-Shirts'),
  ('polo', 'Polos'),
  ('pant', 'Pants'),
  ('jorts', 'Jorts'),
  ('broderie', 'Broderie')
on conflict (id) do nothing;

insert into public.products (id, name, category, price, old_price, sizes, colors, description, images, featured) values
  (1, 'Glitch Cloud Tshirt OverSized', 'tshirt', 3200, 4500,
    array['S','M','L','XL'],
    array['Sky Blue','Washed Black','Vintage White','Faded Grey','Midnight Navy'],
    'Premium heavy cloud-feel oversized streetwear tee.',
    array['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'], true),
  (2, 'Acid Wash Street OverSized Tee', 'tshirt', 3800, 4900,
    array['M','L','XL','XXL'], array['Acid Black','Acid Grey','Acid Olive'],
    'Raw distressed vintage acid-wash treatment.',
    array['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'], false),
  (3, '260 GSM Heavyweight OverSized Tee', 'tshirt', 3500, null,
    array['M','L','XL'], array['Pure White'],
    'Ultra-thick 260 GSM premium cotton structure.',
    array['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80'], false),
  (4, 'Neo-Street Boxy OverSized Tee', 'tshirt', 2400, 3200,
    array['S','M','L','XL','XXL'], array['Pitch Black','Off White','Slate Grey'],
    'The essential daily oversized tee.',
    array['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'], false),
  (8, 'Wide Leg Summer Shorts', 'jorts', 2800, 3600,
    array['M','L','XL'], array['Washed Grey','Khaki'],
    'Baggy wide-leg silhouette designed for summer airflow.',
    array['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'], false),
  (10, 'Haute Couture Half-Sleeve Polo', 'polo', 2500, 3200,
    array['S','M','L','XL'], array['Black','White','Navy','Burgundy'],
    'Smart-street tailored polo with structured collar.',
    array['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'], true),
  (11, 'Baggy Jogger OverSized', 'pant', 3400, 4200,
    array['S','M','L','XL'], array['Black','Charcoal'],
    'Extreme baggy streetwear proportions.',
    array['https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&q=80'], false),
  (20, 'Signature Gold Broderie Tee', 'broderie', 4200, 5200,
    array['S','M','L','XL'], array['Black / Gold','White / Gold'],
    'Hand-finished gold embroidery (broderie) on premium heavyweight cotton.',
    array['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'], true),
  (21, 'Heritage Broderie Hoodie', 'broderie', 5600, null,
    array['M','L','XL','XXL'], array['Cream','Deep Black'],
    'Detailed chest embroidery with a soft brushed interior.',
    array['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'], false)
on conflict (id) do nothing;

insert into public.slider (id, image, title, subtitle, position) values
  ('s1', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80', 'THE GLITCHED SUIT', 'Capsule // 01', 1),
  ('s2', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80', 'NEO-STREET LUXURY', 'Capsule // 02', 2),
  ('s3', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80', 'HAUTE COUTURE', 'Capsule // 03', 3)
on conflict (id) do nothing;
