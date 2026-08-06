-- Only a user with an explicit row using the admin role can use the admin APIs.
CREATE TABLE public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- No client policies are intentionally added. The server checks this table with
-- the service-role client after validating the caller's Supabase access token.
