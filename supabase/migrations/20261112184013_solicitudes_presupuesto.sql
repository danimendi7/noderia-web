-- Solicitudes de presupuesto enviadas desde el formulario de la web (SPEC F4).
-- El público (anon) solo puede insertar; nadie puede leer desde el cliente.
-- Se consultan desde el panel de Supabase.

create table public.solicitudes_presupuesto (
  id uuid primary key default gen_random_uuid(),
  creada timestamptz not null default now(),
  nombre text not null check (char_length(btrim(nombre)) between 1 and 120),
  taller text not null check (char_length(btrim(taller)) between 1 and 160),
  telefono text not null check (char_length(telefono) between 9 and 30),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  ubicacion text check (char_length(ubicacion) <= 120),
  tipo_taller text check (tipo_taller in ('mecanica_general', 'neumaticos', 'chapa_pintura', 'otro')),
  tamano_equipo text check (tamano_equipo in ('1-2', '3-5', '6-10', 'mas_de_10')),
  mensaje text check (char_length(mensaje) <= 2000),
  consentimiento boolean not null check (consentimiento),
  origen text check (char_length(origen) <= 200),
  -- Hash de la IP (con sal en el servidor) para el límite de envíos. Nunca la IP en claro.
  ip_hash text not null check (char_length(ip_hash) between 16 and 128)
);

comment on table public.solicitudes_presupuesto is
  'Solicitudes de presupuesto del formulario de noderia.es. Solo inserción pública; lectura solo desde el panel.';

-- Para contar los envíos recientes de una misma IP.
create index solicitudes_presupuesto_ip_hash_creada_idx
  on public.solicitudes_presupuesto (ip_hash, creada desc);

-- Permisos mínimos: el cliente solo inserta.
revoke all on table public.solicitudes_presupuesto from anon, authenticated;
grant insert on table public.solicitudes_presupuesto to anon, authenticated;

alter table public.solicitudes_presupuesto enable row level security;

create policy "el público puede enviar solicitudes con consentimiento"
  on public.solicitudes_presupuesto
  for insert
  to anon, authenticated
  with check (consentimiento is true);

-- Sin políticas de select/update/delete: nadie puede leer, cambiar ni borrar desde el cliente.

-- Límite de envíos: como máximo 5 por hora y por ip_hash. Se aplica en la base de datos
-- para que tampoco se pueda saltar insertando directamente con la clave pública.
create function public.limitar_solicitudes_presupuesto()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recientes integer;
begin
  -- La fecha la pone siempre el servidor.
  new.creada := now();

  -- Serializa los envíos de una misma IP para que el recuento sea exacto.
  perform pg_advisory_xact_lock(hashtextextended(new.ip_hash, 0));

  select count(*) into recientes
  from public.solicitudes_presupuesto
  where ip_hash = new.ip_hash
    and creada > now() - interval '1 hour';

  if recientes >= 5 then
    raise exception 'limite_envios'
      using errcode = 'P0001',
            hint = 'Demasiadas solicitudes desde la misma conexión. Inténtalo más tarde.';
  end if;

  return new;
end;
$$;

revoke all on function public.limitar_solicitudes_presupuesto() from public, anon, authenticated;

create trigger limitar_solicitudes_presupuesto
  before insert on public.solicitudes_presupuesto
  for each row
  execute function public.limitar_solicitudes_presupuesto();
