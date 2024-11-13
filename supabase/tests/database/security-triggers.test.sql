BEGIN;
SELECT plan(6);

-- Add a dummy user
INSERT INTO auth.users(id, ROLE, raw_user_meta_data) 
VALUES ('00000000-0000-0000-0000-000000000001', 'authenticated', '{"role": "student", "first_name": "John", "last_name": "Doe"}');


-- TEST public.handle_new_user()

-- (1) Check if the trigger inserts data into public.users
PREPARE get_user AS SELECT * FROM public.users LIMIT 1;
SELECT row_eq('get_user', ROW ('00000000-0000-0000-0000-000000000001', 'John', 'Doe')::public.users);
-- (2) Check if the trigger inserts data into public.users
PREPARE get_user_role AS SELECT * FROM public.user_roles LIMIT 1;
SELECT row_eq('get_user_role', ROW ('00000000-0000-0000-0000-000000000001', 'student')::public.user_roles);


-- TEST public.custom_access_token_hook()

-- (3) Check an existing user's role
SELECT is(
    public.custom_access_token_hook('{"user_id": "00000000-0000-0000-0000-000000000001", "claims": {}}'::jsonb),
    '{"user_id": "00000000-0000-0000-0000-000000000001", "claims": {"user_role": "student"}}'::jsonb,
    'Custom access token hook function inserts the user role correctly'
);
-- (4) Check a non-existing user's role
SELECT is(
    public.custom_access_token_hook('{"user_id": "00000000-0000-0000-0000-000000000002", "claims": {}}'::jsonb),
    '{"user_id": "00000000-0000-0000-0000-000000000002", "claims": {"user_role": null}}'::jsonb,
    'Custom access token hook function inserts null for non-existing user role'
);


-- TEST public.authorize()

-- Mock the auth.jwt function
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql
AS $$
SELECT '{"user_role": "student"}'::jsonb;
$$;
-- (5) Check the authorization function for a user with permission
INSERT INTO public.role_permissions (role, permission) VALUES ('student', 'access_instructor_own_data');
SELECT is(
    public.authorize('access_instructor_own_data'),
    TRUE,
    'Authorization function returns true for user with permission'
);
-- (6) Check the authorization function for a user without permission
SELECT is(
    public.authorize('manage_department_data'),
    FALSE,
    'Authorization function returns false for user without permission'
);

SELECT * FROM finish();
ROLLBACK;