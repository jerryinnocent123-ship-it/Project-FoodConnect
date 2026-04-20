alter table public.profile
add column if not exists username text,
add column if not exists images_url text;

create unique index if not exists profile_username_unique_idx
on public.profile (username)
where username is not null;

comment on column public.profile.username is 'Public username for the user profile';
comment on column public.profile.images_url is 'Public URL for the profile image stored in images_user bucket';
