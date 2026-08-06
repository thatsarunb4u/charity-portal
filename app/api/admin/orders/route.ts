import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  const access = await getAdminAccess(request);

  if (!access.authorized) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: access.status });
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, ticket_number, name, email, phone, quantity, amount, dining_option, status")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders });
}
