import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generatePayNowQR } from "@/lib/paynow";
import { notFound } from "next/navigation";
import PaymentButton from "@/components/PaymentButton";

export default async function PayPage({
  params,
}: {
  params: Promise<{ ticket: string }>;
}) {
  const { ticket } = await params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("ticket_number", ticket)
    .single();

  if (!order) {
    notFound();
  }

  const { data: settings } = await supabaseAdmin
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  const qr = await generatePayNowQR(
    settings.paynow_uen,
    settings.merchant_name,
    Number(order.amount),
    order.ticket_number
  );

  return (
    <div className="min-h-screen bg-slate-100">

<div className="mx-auto max-w-4xl p-6">

<div className="rounded-3xl bg-white shadow-xl overflow-hidden">

<img
    src={settings.banner_url}
    className="h-64 w-full object-cover"
/>

<div className="p-8">

<h1 className="text-4xl font-bold">

{settings.event_title}

</h1>

<p className="mt-2 text-slate-600">

Complete your payment using PayNow.

</p>

<hr className="my-8"/>

<div className="grid md:grid-cols-2 gap-10">

<div>

<h2 className="text-2xl font-bold mb-6">

Order Summary

</h2>

<div className="space-y-4">

<div className="flex justify-between">

<span>Booking Id</span>

<b>{order.ticket_number}</b>

</div>

<div className="flex justify-between">

<span>Name</span>

<b>{order.name}</b>

</div>

<div className="flex justify-between">

<span>Quantity</span>

<b>{order.quantity}</b>

</div>

<div className="flex justify-between">

<span>Total</span>

<b className="text-3xl text-green-700">

${Number(order.amount).toFixed(2)}

</b>

</div>

</div>

</div>
<div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left">
  <h3 className="font-bold text-amber-800">
    Before you pay
  </h3>

  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
    <li>Scan the QR code using your banking app.</li>
    <li>Do not change the payment reference.</li>
    <li>Verify the amount before confirming payment.</li>
    <li>After payment, click "I've Completed Payment".</li>
  </ul>
</div>
<div className="text-center">

<img
src={qr}
className="mx-auto w-72 rounded-xl border p-4"
/>

<p className="mt-6">

PayNow Reference

</p>

<p className="text-2xl font-bold">

{order.ticket_number}

</p>

<div className="mt-8">

<PaymentButton ticket={order.ticket_number}/>

</div>

</div>

</div>

</div>

</div>

</div>

</div>
  );
}