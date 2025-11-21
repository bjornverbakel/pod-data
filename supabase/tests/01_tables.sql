BEGIN;
SELECT plan(3);

SELECT has_table('endings');
SELECT has_table('profiles');
SELECT has_table('user_endings');

SELECT * FROM finish();
ROLLBACK;
