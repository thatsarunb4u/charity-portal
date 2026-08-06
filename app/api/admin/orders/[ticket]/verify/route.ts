import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/orders/[ticket]/verify">
) {
  const access = await getAdminAccess(request);

  if (!access.authorized) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: access.status });
  }

  const { ticket } = await context.params;

  if (!ticket.trim()) {
    return NextResponse.json({ error: "Invalid ticket number." }, { status: 400 });
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .update({ status: "Payment Verified" })
    .eq("ticket_number", ticket)
    .select("ticket_number, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
