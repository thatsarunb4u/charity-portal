import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {

    const body = await request.json();

    const { ticket } = body;

    const { error } = await supabaseAdmin
        .from("orders")
        .update({
            status: "Payment Submitted",
        })
        .eq("ticket_number", ticket);

    if (error) {

        return NextResponse.json(error, {
            status: 500,
        });

    }

    return NextResponse.json({
        success: true,
    });

}