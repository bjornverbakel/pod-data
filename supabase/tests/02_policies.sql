BEGIN;
SELECT plan(3);

SELECT policies_are(
    'public',
    'endings',
    ARRAY[
        'Public can read endings',
        'endings_select_auth'
    ]
);

SELECT policies_are(
    'public',
    'profiles',
    ARRAY[
        'Authenticated can insert own profile',
        'Users can read their own profile',
        'Users can update their own profile',
        'profiles_insert_own',
        'profiles_select_own',
        'profiles_update_own'
    ]
);

SELECT policies_are(
    'public',
    'user_endings',
    ARRAY[
        'Users can delete their own user_endings',
        'Users can insert their own user_endings',
        'Users can read their own user_endings',
        'Users can update their own user_endings',
        'user_endings_delete_own',
        'user_endings_insert_own',
        'user_endings_select_own',
        'user_endings_update_own'
    ]
);

SELECT * FROM finish();
ROLLBACK;
