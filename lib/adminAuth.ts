import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getAdminAccess(request: Request) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!accessToken) {
    return { authorized: false, status: 401 as const };
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (userError || !user) {
    return { authorized: false, status: 401 as const };
  }

  const { data: role, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (roleError || role?.role !== "admin") {
    return { authorized: false, status: 403 as const };
  }

  return { authorized: true, user } as const;
}
