BEGIN;
SELECT plan(10);
-- Setup test data (as superuser)
-- We need to insert into auth.users to satisfy foreign key constraints
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'user_a@example.com',
        '{"username": "user_a"}'
    );
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
        '22222222-2222-2222-2222-222222222222',
        'user_b@example.com',
        '{"username": "user_b"}'
    );
INSERT INTO public.endings (id, letter, name, chapter, type, sort_order)
VALUES (
        '33333333-3333-3333-3333-333333333333',
        'T',
        'Test Ending',
        '01',
        'Main',
        999
    );
INSERT INTO public.weapons (id, name, type, acquisition, sort_order)
VALUES (
        '44444444-4444-4444-4444-444444444444',
        'Test Weapon',
        'Small Sword',
        'Shop',
        999
    );
-- 1. Authenticate as User A
-- We simulate a logged-in user by setting the request.jwt.claims and role
SELECT set_config(
        'request.jwt.claims',
        '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}',
        true
    );
SELECT set_config('role', 'authenticated', true);
-- 2. User A creates their profile
-- Profile is created automatically by trigger on auth.users insert
SELECT results_eq(
        $$
        SELECT username
        FROM public.profiles
        WHERE id = '11111111-1111-1111-1111-111111111111' $$,
            $$
        VALUES ('user_a'::text) $$,
            'User A can create and read their own profile'
    );
-- 3. User A marks ending as completed
INSERT INTO public.user_endings (user_id, ending_id, completed)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        '33333333-3333-3333-3333-333333333333',
        true
    );
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.user_endings
        WHERE user_id = '11111111-1111-1111-1111-111111111111' $$,
            $$
        VALUES (1::bigint) $$,
            'User A can create and read their own user_endings'
    );
-- 3b. User A marks weapon as completed
INSERT INTO public.user_weapons (user_id, weapon_id, completed)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444',
        true
    );
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.user_weapons
        WHERE user_id = '11111111-1111-1111-1111-111111111111' $$,
            $$
        VALUES (1::bigint) $$,
            'User A can create and read their own user_weapons'
    );
-- 4. Authenticate as User B
SELECT set_config(
        'request.jwt.claims',
        '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}',
        true
    );
SELECT set_config('role', 'authenticated', true);
-- 5. User B tries to read User A's profile
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.profiles
        WHERE id = '11111111-1111-1111-1111-111111111111' $$,
            $$
        VALUES (0::bigint) $$,
            'User B cannot see User A profile'
    );
-- 6. User B tries to read User A's user_endings
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.user_endings
        WHERE user_id = '11111111-1111-1111-1111-111111111111' $$,
            $$
        VALUES (0::bigint) $$,
            'User B cannot see User A user_endings'
    );
-- 6b. User B tries to read User A's user_weapons
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.user_weapons
        WHERE user_id = '11111111-1111-1111-1111-111111111111' $$,
            $$
        VALUES (0::bigint) $$,
            'User B cannot see User A user_weapons'
    );
-- 7. User B tries to insert data for User A
PREPARE insert_violation AS
INSERT INTO public.user_endings (user_id, ending_id)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        '33333333-3333-3333-3333-333333333333'
    );
SELECT throws_ok(
        'insert_violation',
        'new row violates row-level security policy for table "user_endings"',
        'User B cannot insert data for User A'
    );
-- 7b. User B tries to insert weapon data for User A
PREPARE insert_violation_weapon AS
INSERT INTO public.user_weapons (user_id, weapon_id)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444'
    );
SELECT throws_ok(
        'insert_violation_weapon',
        'new row violates row-level security policy for table "user_weapons"',
        'User B cannot insert weapon data for User A'
    );
-- 8. Anonymous Access
SELECT set_config('request.jwt.claims', '', true);
SELECT set_config('role', 'anon', true);
-- 9. Anon can read endings
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.endings
        WHERE id = '33333333-3333-3333-3333-333333333333' $$,
            $$
        VALUES (1::bigint) $$,
            'Anonymous user can read endings'
    );
-- 10. Anon cannot read profiles
SELECT results_eq(
        $$
        SELECT count(*)
        FROM public.profiles $$,
            $$
        VALUES (0::bigint) $$,
            'Anonymous user cannot read profiles'
    );
SELECT *
FROM finish();
ROLLBACK;