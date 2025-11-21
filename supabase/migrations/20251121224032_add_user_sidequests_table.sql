drop policy "profiles_insert_own" on "public"."profiles";

drop policy "profiles_select_own" on "public"."profiles";

drop policy "profiles_update_own" on "public"."profiles";

drop policy "user_endings_delete_own" on "public"."user_endings";

drop policy "user_endings_insert_own" on "public"."user_endings";

drop policy "user_endings_select_own" on "public"."user_endings";

drop policy "user_endings_update_own" on "public"."user_endings";


  create table "public"."user_sidequests" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "sidequest_id" uuid not null,
    "completed" boolean default false,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_sidequests" enable row level security;

CREATE UNIQUE INDEX user_sidequests_pkey ON public.user_sidequests USING btree (id);

CREATE UNIQUE INDEX user_sidequests_user_id_ending_id_key ON public.user_sidequests USING btree (user_id, sidequest_id);

CREATE INDEX user_sidequests_user_id_idx ON public.user_sidequests USING btree (user_id);

alter table "public"."user_sidequests" add constraint "user_sidequests_pkey" PRIMARY KEY using index "user_sidequests_pkey";

alter table "public"."user_sidequests" add constraint "user_sidequests_sidequest_id_fkey" FOREIGN KEY (sidequest_id) REFERENCES public.sidequests(id) not valid;

alter table "public"."user_sidequests" validate constraint "user_sidequests_sidequest_id_fkey";

alter table "public"."user_sidequests" add constraint "user_sidequests_user_id_ending_id_key" UNIQUE using index "user_sidequests_user_id_ending_id_key";

alter table "public"."user_sidequests" add constraint "user_sidequests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_sidequests" validate constraint "user_sidequests_user_id_fkey";

grant delete on table "public"."sidequests" to "postgres";

grant insert on table "public"."sidequests" to "postgres";

grant references on table "public"."sidequests" to "postgres";

grant select on table "public"."sidequests" to "postgres";

grant trigger on table "public"."sidequests" to "postgres";

grant truncate on table "public"."sidequests" to "postgres";

grant update on table "public"."sidequests" to "postgres";

grant delete on table "public"."user_sidequests" to "anon";

grant insert on table "public"."user_sidequests" to "anon";

grant references on table "public"."user_sidequests" to "anon";

grant select on table "public"."user_sidequests" to "anon";

grant trigger on table "public"."user_sidequests" to "anon";

grant truncate on table "public"."user_sidequests" to "anon";

grant update on table "public"."user_sidequests" to "anon";

grant delete on table "public"."user_sidequests" to "authenticated";

grant insert on table "public"."user_sidequests" to "authenticated";

grant references on table "public"."user_sidequests" to "authenticated";

grant select on table "public"."user_sidequests" to "authenticated";

grant trigger on table "public"."user_sidequests" to "authenticated";

grant truncate on table "public"."user_sidequests" to "authenticated";

grant update on table "public"."user_sidequests" to "authenticated";

grant delete on table "public"."user_sidequests" to "postgres";

grant insert on table "public"."user_sidequests" to "postgres";

grant references on table "public"."user_sidequests" to "postgres";

grant select on table "public"."user_sidequests" to "postgres";

grant trigger on table "public"."user_sidequests" to "postgres";

grant truncate on table "public"."user_sidequests" to "postgres";

grant update on table "public"."user_sidequests" to "postgres";

grant delete on table "public"."user_sidequests" to "service_role";

grant insert on table "public"."user_sidequests" to "service_role";

grant references on table "public"."user_sidequests" to "service_role";

grant select on table "public"."user_sidequests" to "service_role";

grant trigger on table "public"."user_sidequests" to "service_role";

grant truncate on table "public"."user_sidequests" to "service_role";

grant update on table "public"."user_sidequests" to "service_role";


  create policy "Users can delete their own user_sidequests"
  on "public"."user_sidequests"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can insert their own user_sidequests"
  on "public"."user_sidequests"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users can read their own user_sidequests"
  on "public"."user_sidequests"
  as permissive
  for select
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users can update their own user_sidequests"
  on "public"."user_sidequests"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



