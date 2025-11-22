drop policy "Authenticated can insert own profile" on "public"."profiles";

drop policy "Users can read their own profile" on "public"."profiles";

drop policy "Users can delete their own user_endings" on "public"."user_endings";

drop policy "Users can insert their own user_endings" on "public"."user_endings";

drop policy "Users can read their own user_endings" on "public"."user_endings";

drop policy "Users can update their own user_endings" on "public"."user_endings";

drop policy "Users can delete their own user_sidequests" on "public"."user_sidequests";

drop policy "Users can insert their own user_sidequests" on "public"."user_sidequests";

drop policy "Users can read their own user_sidequests" on "public"."user_sidequests";

drop policy "Users can update their own user_sidequests" on "public"."user_sidequests";

drop policy "Users can update their own profile" on "public"."profiles";


  create table "public"."achievements" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text not null,
    "guide_url" text,
    "created_at" timestamp with time zone default now(),
    "sort_order" integer not null,
    "icon_url" text not null
      );


alter table "public"."achievements" enable row level security;


  create table "public"."user_achievements" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "achievement_id" uuid not null,
    "completed" boolean default false,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."user_achievements" enable row level security;

CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id);

CREATE UNIQUE INDEX user_achievements_pkey ON public.user_achievements USING btree (id);

CREATE UNIQUE INDEX user_achievements_user_id_ending_id_key ON public.user_achievements USING btree (user_id, achievement_id);

CREATE INDEX user_achievements_user_id_idx ON public.user_achievements USING btree (user_id);

alter table "public"."achievements" add constraint "achievements_pkey" PRIMARY KEY using index "achievements_pkey";

alter table "public"."user_achievements" add constraint "user_achievements_pkey" PRIMARY KEY using index "user_achievements_pkey";

alter table "public"."user_achievements" add constraint "user_achievements_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) not valid;

alter table "public"."user_achievements" validate constraint "user_achievements_achievement_id_fkey";

alter table "public"."user_achievements" add constraint "user_achievements_user_id_ending_id_key" UNIQUE using index "user_achievements_user_id_ending_id_key";

alter table "public"."user_achievements" add constraint "user_achievements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_achievements" validate constraint "user_achievements_user_id_fkey";

grant delete on table "public"."achievements" to "anon";

grant insert on table "public"."achievements" to "anon";

grant references on table "public"."achievements" to "anon";

grant select on table "public"."achievements" to "anon";

grant trigger on table "public"."achievements" to "anon";

grant truncate on table "public"."achievements" to "anon";

grant update on table "public"."achievements" to "anon";

grant delete on table "public"."achievements" to "authenticated";

grant insert on table "public"."achievements" to "authenticated";

grant references on table "public"."achievements" to "authenticated";

grant select on table "public"."achievements" to "authenticated";

grant trigger on table "public"."achievements" to "authenticated";

grant truncate on table "public"."achievements" to "authenticated";

grant update on table "public"."achievements" to "authenticated";

grant delete on table "public"."achievements" to "postgres";

grant insert on table "public"."achievements" to "postgres";

grant references on table "public"."achievements" to "postgres";

grant select on table "public"."achievements" to "postgres";

grant trigger on table "public"."achievements" to "postgres";

grant truncate on table "public"."achievements" to "postgres";

grant update on table "public"."achievements" to "postgres";

grant delete on table "public"."achievements" to "service_role";

grant insert on table "public"."achievements" to "service_role";

grant references on table "public"."achievements" to "service_role";

grant select on table "public"."achievements" to "service_role";

grant trigger on table "public"."achievements" to "service_role";

grant truncate on table "public"."achievements" to "service_role";

grant update on table "public"."achievements" to "service_role";

grant delete on table "public"."user_achievements" to "anon";

grant insert on table "public"."user_achievements" to "anon";

grant references on table "public"."user_achievements" to "anon";

grant select on table "public"."user_achievements" to "anon";

grant trigger on table "public"."user_achievements" to "anon";

grant truncate on table "public"."user_achievements" to "anon";

grant update on table "public"."user_achievements" to "anon";

grant delete on table "public"."user_achievements" to "authenticated";

grant insert on table "public"."user_achievements" to "authenticated";

grant references on table "public"."user_achievements" to "authenticated";

grant select on table "public"."user_achievements" to "authenticated";

grant trigger on table "public"."user_achievements" to "authenticated";

grant truncate on table "public"."user_achievements" to "authenticated";

grant update on table "public"."user_achievements" to "authenticated";

grant delete on table "public"."user_achievements" to "postgres";

grant insert on table "public"."user_achievements" to "postgres";

grant references on table "public"."user_achievements" to "postgres";

grant select on table "public"."user_achievements" to "postgres";

grant trigger on table "public"."user_achievements" to "postgres";

grant truncate on table "public"."user_achievements" to "postgres";

grant update on table "public"."user_achievements" to "postgres";

grant delete on table "public"."user_achievements" to "service_role";

grant insert on table "public"."user_achievements" to "service_role";

grant references on table "public"."user_achievements" to "service_role";

grant select on table "public"."user_achievements" to "service_role";

grant trigger on table "public"."user_achievements" to "service_role";

grant truncate on table "public"."user_achievements" to "service_role";

grant update on table "public"."user_achievements" to "service_role";


  create policy "Enable read access for all users"
  on "public"."achievements"
  as permissive
  for select
  to public
using (true);



  create policy "Enable insert for users based on user_id"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Enable users to view their own data only"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Enable delete for users based on user_id"
  on "public"."user_achievements"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."user_achievements"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to update their own data only"
  on "public"."user_achievements"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."user_achievements"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."user_endings"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."user_endings"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to update their own data only"
  on "public"."user_endings"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."user_endings"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable delete for users based on user_id"
  on "public"."user_sidequests"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for users based on user_id"
  on "public"."user_sidequests"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to update their own data only"
  on "public"."user_sidequests"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."user_sidequests"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update their own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



