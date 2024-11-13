-- Add a new row in the users and user_roles table when a new user is created in the auth schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert the new user into the users table
  -- NOTE: during registration, the role-specific columns will be added later and will reference this
  INSERT INTO public.users (id, first_name, last_name)
  VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name'
  );

  -- Insert the new user's role into the user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
      NEW.id,
      NEW.raw_user_meta_data ->> 'role'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Create the custom access token auth hook function
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    claims jsonb;
    user_role public.app_role;
BEGIN
    -- Fetch all roles for the user
    SELECT role INTO user_role FROM public.user_roles WHERE user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    IF user_role IS NOT NULL THEN
        -- Set the claim
        claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    ELSE
        claims := jsonb_set(claims, '{user_role}', 'null');
    END IF;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    RETURN event;
END;
$$;


-- Grant necessary permissions for the auth hook
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

GRANT ALL ON TABLE public.user_roles TO supabase_auth_admin;

REVOKE ALL ON TABLE public.user_roles FROM authenticated, anon, public;

CREATE POLICY "Allow auth admin to read user roles" ON public.user_roles
AS PERMISSIVE FOR SELECT
TO supabase_auth_admin
USING (TRUE);


-- Create the authorization function
CREATE OR REPLACE FUNCTION public.authorize(
    requested_permission public.app_permission
)
RETURNS BOOLEAN 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    has_permission INT;
BEGIN
    SELECT COUNT(*)
    INTO has_permission
    FROM public.role_permissions
    WHERE permission = authorize.requested_permission
    AND role = (auth.jwt() ->> 'user_role')::public.app_role;

    -- NOTE: has_permission will be 1 if the user has the requested permission
    RETURN has_permission > 0;
END;
$$;
