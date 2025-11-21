
  create table "public"."endings" (
    "id" uuid not null default gen_random_uuid(),
    "letter" text not null,
    "name" text not null,
    "chapter" text not null,
    "type" text not null,
    "guide_url" text,
    "created_at" timestamp with time zone default now(),
    "sort_order" integer not null
      );


alter table "public"."endings" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "username" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."user_endings" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "ending_id" uuid not null,
    "completed" boolean default false,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_endings" enable row level security;

CREATE UNIQUE INDEX endings_pkey ON public.endings USING btree (id);

CREATE INDEX idx_profiles_id ON public.profiles USING btree (id);

CREATE INDEX idx_user_endings_user_id ON public.user_endings USING btree (user_id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX user_endings_pkey ON public.user_endings USING btree (id);

CREATE UNIQUE INDEX user_endings_user_id_ending_id_key ON public.user_endings USING btree (user_id, ending_id);

alter table "public"."endings" add constraint "endings_pkey" PRIMARY KEY using index "endings_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."user_endings" add constraint "user_endings_pkey" PRIMARY KEY using index "user_endings_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."user_endings" add constraint "user_endings_ending_id_fkey" FOREIGN KEY (ending_id) REFERENCES public.endings(id) ON DELETE CASCADE not valid;

alter table "public"."user_endings" validate constraint "user_endings_ending_id_fkey";

alter table "public"."user_endings" add constraint "user_endings_user_id_ending_id_key" UNIQUE using index "user_endings_user_id_ending_id_key";

alter table "public"."user_endings" add constraint "user_endings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_endings" validate constraint "user_endings_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$ SELECT auth.uid(); $function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  -- body preserved: call public.set_search_path_public to ensure behavior
  PERFORM public.set_search_path_public();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_search_path_public()
 RETURNS void
 LANGUAGE sql
 SET search_path TO 'public', 'pg_catalog'
AS $function$
  -- intentionally minimal: ensure search_path is public,pg_catalog within session
  SELECT set_config('search_path', 'public, pg_catalog', true);
$function$
;

grant delete on table "public"."endings" to "anon";

grant insert on table "public"."endings" to "anon";

grant references on table "public"."endings" to "anon";

grant select on table "public"."endings" to "anon";

grant trigger on table "public"."endings" to "anon";

grant truncate on table "public"."endings" to "anon";

grant update on table "public"."endings" to "anon";

grant delete on table "public"."endings" to "authenticated";

grant insert on table "public"."endings" to "authenticated";

grant references on table "public"."endings" to "authenticated";

grant select on table "public"."endings" to "authenticated";

grant trigger on table "public"."endings" to "authenticated";

grant truncate on table "public"."endings" to "authenticated";

grant update on table "public"."endings" to "authenticated";

grant delete on table "public"."endings" to "service_role";

grant insert on table "public"."endings" to "service_role";

grant references on table "public"."endings" to "service_role";

grant select on table "public"."endings" to "service_role";

grant trigger on table "public"."endings" to "service_role";

grant truncate on table "public"."endings" to "service_role";

grant update on table "public"."endings" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."user_endings" to "anon";

grant insert on table "public"."user_endings" to "anon";

grant references on table "public"."user_endings" to "anon";

grant select on table "public"."user_endings" to "anon";

grant trigger on table "public"."user_endings" to "anon";

grant truncate on table "public"."user_endings" to "anon";

grant update on table "public"."user_endings" to "anon";

grant delete on table "public"."user_endings" to "authenticated";

grant insert on table "public"."user_endings" to "authenticated";

grant references on table "public"."user_endings" to "authenticated";

grant select on table "public"."user_endings" to "authenticated";

grant trigger on table "public"."user_endings" to "authenticated";

grant truncate on table "public"."user_endings" to "authenticated";

grant update on table "public"."user_endings" to "authenticated";

grant delete on table "public"."user_endings" to "service_role";

grant insert on table "public"."user_endings" to "service_role";

grant references on table "public"."user_endings" to "service_role";

grant select on table "public"."user_endings" to "service_role";

grant trigger on table "public"."user_endings" to "service_role";

grant truncate on table "public"."user_endings" to "service_role";

grant update on table "public"."user_endings" to "service_role";


  create policy "Public can read endings"
  on "public"."endings"
  as permissive
  for select
  to public
using (true);



  create policy "endings_select_auth"
  on "public"."endings"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Authenticated can insert own profile"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = id));



  create policy "Users can read their own profile"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "profiles_insert_own"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((id = public.get_user_id()));



  create policy "profiles_select_own"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((id = public.get_user_id()));



  create policy "profiles_update_own"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((id = public.get_user_id()))
with check ((id = public.get_user_id()));



  create policy "Users can delete their own user_endings"
  on "public"."user_endings"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can insert their own user_endings"
  on "public"."user_endings"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can read their own user_endings"
  on "public"."user_endings"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can update their own user_endings"
  on "public"."user_endings"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "user_endings_delete_own"
  on "public"."user_endings"
  as permissive
  for delete
  to authenticated
using ((user_id = public.get_user_id()));



  create policy "user_endings_insert_own"
  on "public"."user_endings"
  as permissive
  for insert
  to authenticated
with check ((user_id = public.get_user_id()));



  create policy "user_endings_select_own"
  on "public"."user_endings"
  as permissive
  for select
  to authenticated
using ((user_id = public.get_user_id()));



  create policy "user_endings_update_own"
  on "public"."user_endings"
  as permissive
  for update
  to authenticated
using ((user_id = public.get_user_id()))
with check ((user_id = public.get_user_id()));



