BEGIN;
SELECT plan(19);
SELECT policies_are(
        'public',
        'endings',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'profiles',
        ARRAY [
        'Enable insert for users based on user_id',
        'Enable users to view their own data only',
        'Users can update their own profile'
    ]
    );
SELECT policies_are(
        'public',
        'user_endings',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'achievements',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_achievements',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'archives',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_archives',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'enemies',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_enemies',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'fish',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_fish',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'novels',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_novels',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'pod_programs',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_pod_programs',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'sidequests',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_sidequests',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT policies_are(
        'public',
        'weapons',
        ARRAY [
        'Enable read access for all users'
    ]
    );
SELECT policies_are(
        'public',
        'user_weapons',
        ARRAY [
        'Enable delete for users based on user_id',
        'Enable insert for users based on user_id',
        'Enable users to update their own data only',
        'Enable users to view their own data only'
    ]
    );
SELECT *
FROM finish();
ROLLBACK;