alter table public.restaurants
add column if not exists zone text,
add column if not exists lat double precision,
add column if not exists lng double precision;

create index if not exists restaurants_owner_id_idx
on public.restaurants (owner_id);

create index if not exists restaurants_zone_idx
on public.restaurants (zone);

comment on column public.restaurants.zone is 'Restaurant zone or neighborhood';
comment on column public.restaurants.lat is 'Restaurant latitude';
comment on column public.restaurants.lng is 'Restaurant longitude';

update public.restaurants
set zone = 'Petion-Ville', lat = 18.5123, lng = -72.2852
where lower(name) = lower('Le Gourmet');

update public.restaurants
set zone = 'Delmas', lat = 18.5447, lng = -72.3026
where lower(name) = lower('Chez Rosy');

update public.restaurants
set zone = 'Petion-Ville', lat = 18.5108, lng = -72.2901
where lower(name) = lower('La Kay');

update public.restaurants
set zone = 'Delmas', lat = 18.5412, lng = -72.3105
where lower(name) = lower('Boulevard Resto');

update public.restaurants
set zone = 'Petion-Ville', lat = 18.5156, lng = -72.2823
where lower(name) = lower('Villa Creole');

update public.restaurants
set zone = 'Peguy-Ville', lat = 18.5289, lng = -72.2950
where lower(name) = lower('Le Rendez-Vous');

update public.restaurants
set zone = 'Carrefour', lat = 18.5342, lng = -72.3891
where lower(name) = lower('Les Delices de Marthe');

update public.restaurants
set zone = 'Petion-Ville', lat = 18.5117, lng = -72.2884
where lower(name) = lower('Ti Marche');

update public.restaurants
set zone = 'Delmas', lat = 18.5430, lng = -72.3078
where lower(name) = lower('Chez Nounoune');

update public.restaurants
set zone = 'Petion-Ville', lat = 18.5095, lng = -72.2932
where lower(name) = lower('Le Peristyle');

update public.restaurants
set zone = 'Croix-des-Bouquets', lat = 18.5762, lng = -72.2285
where lower(name) = lower('Lakou Lakay');

update public.restaurants
set zone = 'Carrefour', lat = 18.5305, lng = -72.3950
where lower(name) = lower('Chez Yvonne');
