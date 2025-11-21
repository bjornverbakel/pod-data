drop policy "Public can read endings" on "public"."endings";

drop policy "endings_select_auth" on "public"."endings";


  create table "public"."sidequests" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "chapter" text,
    "guide_url" text,
    "created_at" timestamp with time zone default now(),
    "sort_order" integer not null,
    "client" text not null,
    "location" text not null,
    "clearable_by" text[] not null
      );


alter table "public"."sidequests" enable row level security;

CREATE UNIQUE INDEX sidequests_pkey ON public.sidequests USING btree (id);

alter table "public"."sidequests" add constraint "sidequests_pkey" PRIMARY KEY using index "sidequests_pkey";

grant delete on table "public"."sidequests" to "anon";

grant insert on table "public"."sidequests" to "anon";

grant references on table "public"."sidequests" to "anon";

grant select on table "public"."sidequests" to "anon";

grant trigger on table "public"."sidequests" to "anon";

grant truncate on table "public"."sidequests" to "anon";

grant update on table "public"."sidequests" to "anon";

grant delete on table "public"."sidequests" to "authenticated";

grant insert on table "public"."sidequests" to "authenticated";

grant references on table "public"."sidequests" to "authenticated";

grant select on table "public"."sidequests" to "authenticated";

grant trigger on table "public"."sidequests" to "authenticated";

grant truncate on table "public"."sidequests" to "authenticated";

grant update on table "public"."sidequests" to "authenticated";

grant delete on table "public"."sidequests" to "postgres";

grant insert on table "public"."sidequests" to "postgres";

grant references on table "public"."sidequests" to "postgres";

grant select on table "public"."sidequests" to "postgres";

grant trigger on table "public"."sidequests" to "postgres";

grant truncate on table "public"."sidequests" to "postgres";

grant update on table "public"."sidequests" to "postgres";

grant delete on table "public"."sidequests" to "service_role";

grant insert on table "public"."sidequests" to "service_role";

grant references on table "public"."sidequests" to "service_role";

grant select on table "public"."sidequests" to "service_role";

grant trigger on table "public"."sidequests" to "service_role";

grant truncate on table "public"."sidequests" to "service_role";

grant update on table "public"."sidequests" to "service_role";


  create policy "Enable read access for all users"
  on "public"."endings"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."sidequests"
  as permissive
  for select
  to public
using (true);



