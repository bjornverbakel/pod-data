-- Drop redundant indexes (covered by primary keys or other unique indexes)
DROP INDEX IF EXISTS public.idx_profiles_id;
DROP INDEX IF EXISTS public.idx_user_endings_user_id;
DROP INDEX IF EXISTS public.user_sidequests_user_id_idx;
DROP INDEX IF EXISTS public.user_achievements_user_id_idx;
DROP INDEX IF EXISTS public.user_archives_user_id_idx;
DROP INDEX IF EXISTS public.user_enemies_user_id_idx;
DROP INDEX IF EXISTS public.user_fish_user_id_idx;
DROP INDEX IF EXISTS public.user_novels_user_id_idx;
DROP INDEX IF EXISTS public.user_pod_programs_user_id_idx;
DROP INDEX IF EXISTS public.user_weapons_user_id_idx;
-- Rename incorrectly named constraints (and their underlying indexes)
ALTER TABLE public.user_sidequests
    RENAME CONSTRAINT user_sidequests_user_id_ending_id_key TO user_sidequests_user_id_sidequest_id_key;
ALTER TABLE public.user_achievements
    RENAME CONSTRAINT user_achievements_user_id_ending_id_key TO user_achievements_user_id_achievement_id_key;
ALTER TABLE public.user_archives
    RENAME CONSTRAINT user_archives_user_id_ending_id_key TO user_archives_user_id_archive_id_key;
ALTER TABLE public.user_enemies
    RENAME CONSTRAINT user_enemies_user_id_ending_id_key TO user_enemies_user_id_enemy_id_key;
ALTER TABLE public.user_fish
    RENAME CONSTRAINT user_fish_user_id_ending_id_key TO user_fish_user_id_fish_id_key;
ALTER TABLE public.user_novels
    RENAME CONSTRAINT user_novels_user_id_ending_id_key TO user_novels_user_id_novel_id_key;
ALTER TABLE public.user_pod_programs
    RENAME CONSTRAINT user_pod_programs_user_id_ending_id_key TO user_pod_programs_user_id_pod_program_id_key;
ALTER TABLE public.user_weapons
    RENAME CONSTRAINT user_weapons_user_id_ending_id_key TO user_weapons_user_id_weapon_id_key;
-- Rename incorrectly named foreign key
ALTER TABLE public.user_enemies
    RENAME CONSTRAINT user_enemies_weapon_id_fkey1 TO user_enemies_enemy_id_fkey;