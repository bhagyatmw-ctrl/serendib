-- Sri Lanka Travel Companion: initial production schema
create extension if not exists pgcrypto;

create type public.app_role as enum ('traveler', 'editor', 'admin');
create type public.publish_status as enum ('draft', 'published', 'archived');
create type public.place_category as enum ('accommodation', 'restaurant', 'guide', 'activity', 'transport');
create type public.budget_level as enum ('budget', 'comfort', 'luxury');
create type public.trip_status as enum ('draft', 'planned', 'active', 'completed', 'cancelled');
create type public.media_kind as enum ('image', 'video');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.app_role not null default 'traveler',
  home_country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  description text,
  province text not null,
  district text,
  latitude numeric(9,6) not null check (latitude between -90 and 90),
  longitude numeric(9,6) not null check (longitude between -180 and 180),
  entry_fee_lkr numeric(12,2) check (entry_fee_lkr >= 0),
  best_months smallint[] not null default '{}',
  status public.publish_status not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_best_months check (best_months <@ array[1,2,3,4,5,6,7,8,9,10,11,12]::smallint[])
);

create table public.places (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid references public.destinations(id) on delete set null,
  category public.place_category not null,
  slug text not null unique,
  name text not null,
  summary text not null,
  description text,
  address text,
  latitude numeric(9,6) check (latitude between -90 and 90),
  longitude numeric(9,6) check (longitude between -180 and 180),
  price_level smallint check (price_level between 1 and 4),
  contact jsonb not null default '{}'::jsonb,
  attributes jsonb not null default '{}'::jsonb,
  verified boolean not null default false,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  start_date date,
  end_date date,
  party_size smallint not null default 1 check (party_size between 1 and 50),
  budget_level public.budget_level not null default 'comfort',
  budget_lkr numeric(14,2) check (budget_lkr >= 0),
  interests text[] not null default '{}',
  status public.trip_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_trip_dates check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number smallint not null check (day_number > 0),
  date date,
  title text,
  notes text,
  created_at timestamptz not null default now(),
  unique (trip_id, day_number)
);

create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_day_id uuid not null references public.itinerary_days(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete set null,
  place_id uuid references public.places(id) on delete set null,
  title text not null,
  starts_at time,
  ends_at time,
  estimated_cost_lkr numeric(12,2) not null default 0 check (estimated_cost_lkr >= 0),
  transport_mode text,
  notes text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint valid_item_times check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text not null,
  cover_image_url text,
  status public.publish_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text not null,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint review_has_one_target check (num_nonnulls(destination_id, place_id) = 1),
  unique nulls not distinct (user_id, destination_id, place_id)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_id uuid references public.destinations(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorite_has_one_target check (num_nonnulls(destination_id, place_id) = 1),
  unique nulls not distinct (user_id, destination_id, place_id)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  destination_id uuid references public.destinations(id) on delete cascade,
  place_id uuid references public.places(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  kind public.media_kind not null,
  storage_path text not null unique,
  alt_text text,
  caption text,
  credit text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  constraint media_has_one_target check (num_nonnulls(destination_id, place_id, article_id) = 1),
  constraint image_requires_alt_text check (kind <> 'image' or nullif(trim(alt_text), '') is not null)
);

create index destinations_status_featured_idx on public.destinations(status, featured);
create index places_destination_category_idx on public.places(destination_id, category) where status = 'published';
create index places_attributes_idx on public.places using gin(attributes);
create index trips_user_updated_idx on public.trips(user_id, updated_at desc);
create index itinerary_items_day_order_idx on public.itinerary_items(itinerary_day_id, sort_order);
create index articles_status_published_idx on public.articles(status, published_at desc);
create index reviews_destination_idx on public.reviews(destination_id) where status = 'published';
create index reviews_place_idx on public.reviews(place_id) where status = 'published';

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger destinations_set_updated_at before update on public.destinations for each row execute function public.set_updated_at();
create trigger places_set_updated_at before update on public.places for each row execute function public.set_updated_at();
create trigger trips_set_updated_at before update on public.trips for each row execute function public.set_updated_at();
create trigger articles_set_updated_at before update on public.articles for each row execute function public.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_content_manager()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('editor', 'admin'));
$$;

alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.places enable row level security;
alter table public.trips enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.articles enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.media_assets enable row level security;

create policy "profiles readable by everyone" on public.profiles for select using (true);
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "published destinations readable" on public.destinations for select using (status = 'published' or public.is_content_manager());
create policy "content managers manage destinations" on public.destinations for all using (public.is_content_manager()) with check (public.is_content_manager());
create policy "published places readable" on public.places for select using (status = 'published' or public.is_content_manager());
create policy "content managers manage places" on public.places for all using (public.is_content_manager()) with check (public.is_content_manager());

create policy "users manage own trips" on public.trips for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users manage own itinerary days" on public.itinerary_days for all using (exists(select 1 from public.trips where trips.id = trip_id and trips.user_id = auth.uid())) with check (exists(select 1 from public.trips where trips.id = trip_id and trips.user_id = auth.uid()));
create policy "users manage own itinerary items" on public.itinerary_items for all using (exists(select 1 from public.itinerary_days d join public.trips t on t.id = d.trip_id where d.id = itinerary_day_id and t.user_id = auth.uid())) with check (exists(select 1 from public.itinerary_days d join public.trips t on t.id = d.trip_id where d.id = itinerary_day_id and t.user_id = auth.uid()));

create policy "published articles readable" on public.articles for select using (status = 'published' or author_id = auth.uid() or public.is_content_manager());
create policy "authors and managers manage articles" on public.articles for all using (author_id = auth.uid() or public.is_content_manager()) with check (author_id = auth.uid() or public.is_content_manager());

create policy "published reviews readable" on public.reviews for select using (status = 'published' or user_id = auth.uid() or public.is_content_manager());
create policy "users create reviews" on public.reviews for insert with check (user_id = auth.uid());
create policy "users update own reviews" on public.reviews for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users delete own reviews" on public.reviews for delete using (user_id = auth.uid() or public.is_content_manager());
create policy "users manage own favorites" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "published media readable" on public.media_assets for select using (
  public.is_content_manager()
  or exists(select 1 from public.destinations d where d.id = destination_id and d.status = 'published')
  or exists(select 1 from public.places p where p.id = place_id and p.status = 'published')
  or exists(select 1 from public.articles a where a.id = article_id and a.status = 'published')
);
create policy "content managers manage media metadata" on public.media_assets for all using (public.is_content_manager()) with check (public.is_content_manager());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('travel-media', 'travel-media', true, 52428800, array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm'])
on conflict (id) do nothing;

create policy "public travel media readable" on storage.objects for select using (bucket_id = 'travel-media');
create policy "content managers upload travel media" on storage.objects for insert with check (bucket_id = 'travel-media' and public.is_content_manager());
create policy "content managers update travel media" on storage.objects for update using (bucket_id = 'travel-media' and public.is_content_manager());
create policy "content managers delete travel media" on storage.objects for delete using (bucket_id = 'travel-media' and public.is_content_manager());
