-- ColorIA — esquema inicial
-- Ejecutar en Supabase: panel del proyecto → SQL Editor → New query → pegar → Run.

-- =========================================
-- Tabla: profiles
-- =========================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text,
  save_photo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Crea el perfil automáticamente al registrarse un usuario.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================
-- Tabla: analyses
-- =========================================
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  season text not null,
  secondary_season text,
  confidence numeric(4, 3),
  temperature text,
  depth text,
  intensity text,
  contrast text,
  image_quality text,
  warnings jsonb not null default '[]'::jsonb,
  questionnaire_answers jsonb not null default '{}'::jsonb,
  technical_results jsonb not null default '{}'::jsonb,
  palette_snapshot jsonb not null default '{}'::jsonb,
  algorithm_version text,
  photo_path text
);

create index if not exists analyses_user_id_created_at_idx
  on public.analyses (user_id, created_at desc);

alter table public.analyses enable row level security;

drop policy if exists "analyses_select_own" on public.analyses;
create policy "analyses_select_own"
  on public.analyses for select
  using (auth.uid() = user_id);

drop policy if exists "analyses_insert_own" on public.analyses;
create policy "analyses_insert_own"
  on public.analyses for insert
  with check (auth.uid() = user_id);

drop policy if exists "analyses_update_own" on public.analyses;
create policy "analyses_update_own"
  on public.analyses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_delete_own"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- =========================================
-- Storage privado para selfies (solo si el usuario lo autoriza)
-- =========================================
-- Una policy RLS no puede expresar limites de tamano ni de tipo MIME: eso se
-- configura en el propio bucket. 5 MB y solo imagenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'selfies',
  'selfies',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types,
      public = false;

-- Cada usuario solo accede a su carpeta: selfies/<user_id>/archivo.jpg
drop policy if exists "selfies_select_own" on storage.objects;
create policy "selfies_select_own"
  on storage.objects for select
  using (
    bucket_id = 'selfies'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "selfies_insert_own" on storage.objects;
create policy "selfies_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'selfies'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "selfies_delete_own" on storage.objects;
create policy "selfies_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'selfies'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- =========================================
-- Panel administrativo
-- =========================================
-- Con RLS activo, una consulta normal desde el navegador solo devuelve las filas
-- del propio usuario: un panel que consultara `analyses` directamente mostraria
-- cifras verosimiles pero falsas. Las metricas se sirven con una funcion
-- security definer que valida al administrador en el servidor.

create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Sin policies: la tabla solo es accesible desde funciones security definer.
alter table public.admins enable row level security;

-- IMPORTANTE: registra aqui el correo administrador, con la misma direccion con
-- la que inicias sesion en la app.
--   insert into public.admins (email) values ('tucorreo@ejemplo.com');

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where email = (auth.jwt() ->> 'email')
  );
$$;

create or replace function public.admin_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  return json_build_object(
    'total_analyses', (select count(*) from public.analyses),
    'registered_users', (select count(*) from public.profiles),
    'analyses_with_photo', (select count(*) from public.analyses where photo_path is not null),
    'average_confidence', (
      select coalesce(round(avg(confidence)::numeric, 3), 0) from public.analyses
    ),
    'season_distribution', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json)
      from (
        select season, count(*)::int as count
        from public.analyses group by season order by count desc
      ) t
    ),
    'quality_distribution', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json)
      from (
        select coalesce(image_quality, 'desconocida') as quality, count(*)::int as count
        from public.analyses group by 1 order by count desc
      ) t
    ),
    'algorithm_versions', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json)
      from (
        select coalesce(algorithm_version, 'desconocida') as version, count(*)::int as count
        from public.analyses group by 1 order by count desc
      ) t
    ),
    'frequent_warnings', (
      select coalesce(json_agg(row_to_json(t)), '[]'::json)
      from (
        select w as warning, count(*)::int as count
        from public.analyses, jsonb_array_elements_text(warnings) as w
        group by w order by count desc limit 10
      ) t
    )
  );
end;
$$;

revoke all on function public.admin_stats() from public, anon;
grant execute on function public.admin_stats() to authenticated;
