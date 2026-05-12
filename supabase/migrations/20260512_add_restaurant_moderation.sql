create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profile
    where id = auth.uid()
      and lower(coalesce(role, '')) = 'admin'
  );
$$;

alter table public.restaurants
  add column if not exists status text;

update public.restaurants
set status = case
  when status is not null then status
  when verified = true then 'approved'
  else 'pending'
end
where status is null;

alter table public.restaurants
  alter column status set default 'pending';

alter table public.restaurants
  alter column status set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'restaurants_status_check'
      and conrelid = 'public.restaurants'::regclass
  ) then
    alter table public.restaurants
      add constraint restaurants_status_check
      check (status in ('pending', 'approved', 'rejected', 'suspended'));
  end if;
end $$;

update public.restaurants
set verified = (status = 'approved')
where verified is distinct from (status = 'approved');

alter table public.restaurants enable row level security;

create or replace function public.enforce_restaurant_moderation_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    if not public.is_admin_user() then
      raise exception 'Only admins can delete restaurant submissions.';
    end if;

    return old;
  end if;

  if (
    new.status is distinct from old.status
    or new.verified is distinct from old.verified
  ) and not public.is_admin_user() then
    raise exception 'Only admins can change restaurant moderation status.';
  end if;

  if new.status is distinct from old.status then
    new.verified := (new.status = 'approved');
  end if;

  return new;
end;
$$;

drop trigger if exists restaurants_moderation_guard on public.restaurants;

create trigger restaurants_moderation_guard
before update or delete on public.restaurants
for each row
execute function public.enforce_restaurant_moderation_guard();

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'restaurants'
      and policyname = 'restaurants_public_read_approved'
  ) then
    create policy restaurants_public_read_approved
      on public.restaurants
      for select
      using (
        status = 'approved'
        or (status is null and verified = true)
        or owner_id = auth.uid()
        or public.is_admin_user()
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'restaurants'
      and policyname = 'restaurants_owner_insert'
  ) then
    create policy restaurants_owner_insert
      on public.restaurants
      for insert
      with check (
        owner_id = auth.uid()
        or public.is_admin_user()
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'restaurants'
      and policyname = 'restaurants_owner_update_profile'
  ) then
    create policy restaurants_owner_update_profile
      on public.restaurants
      for update
      using (
        owner_id = auth.uid()
        or public.is_admin_user()
      )
      with check (
        owner_id = auth.uid()
        or public.is_admin_user()
      );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'restaurants'
      and policyname = 'restaurants_admin_delete'
  ) then
    create policy restaurants_admin_delete
      on public.restaurants
      for delete
      using (public.is_admin_user());
  end if;
end $$;
