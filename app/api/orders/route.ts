import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function generateTicket(no: number) {
    return `BR-${new Date().getFullYear()}-${String(no).padStart(6,"0")}`;
}

export async function POST(request: Request) {

    const body = await request.json();

    const { name, phone, email, dining_option, contact_consent, quantity } = body;

    const isValidOrderOption = dining_option === "collect_for_self" || dining_option === "donate";

    if (
        typeof name !== "string" || !name.trim() ||
        typeof phone !== "string" || !phone.trim() ||
        typeof email !== "string" || !email.trim() ||
        !isValidOrderOption ||
        typeof contact_consent !== "boolean" ||
        !Number.isInteger(quantity) || quantity <= 0
    ) {

        return NextResponse.json(
            { error: "Invalid data" },
            { status: 400 }
        );

    }

    const { count } = await supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true });

    function generateTicket(serial: number) {

    const year = new Date().getFullYear();

    return `BR-${year}-${serial
        .toString()
        .padStart(6,"0")}`;

}



    const { data: settings } = await supabaseAdmin
  .from("settings")
  .select("*")
  .eq("id", 1)
  .single();

if (!settings) {
  return NextResponse.json(
    { error: "Settings not found" },
    { status: 500 }
  );
}

const unitPrice = Number(settings.price);

    const { data: order, error } = await supabaseAdmin
  .from("orders")
  .insert({
    name,
    phone,
    email,
    dining_option,
    contact_consent,
    quantity,
    unit_price: unitPrice,
    amount: quantity * unitPrice,
  })
  .select("id,serial")
  .single();
    if (error) {

        return NextResponse.json(error, { status: 500 });

    }

    const ticket = generateTicket(order.serial);

    await supabaseAdmin
.from("orders")
.update({

    ticket_number:ticket,

    payment_reference:ticket

})
.eq("id",order.id);

    return NextResponse.json({

    success:true,

    ticket

});

}
