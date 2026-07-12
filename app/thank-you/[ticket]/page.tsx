import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ThankYouPage({
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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl p-6">

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

          <img
            src={settings.banner_url}
            alt={settings.event_title}
            className="h-64 w-full object-cover"
          />

          <div className="p-8 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <span className="text-5xl">✓</span>
            </div>

            <h1 className="mt-6 text-4xl font-bold text-green-700">
              Payment Submitted
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              Thank you for supporting our charity event.
            </p>

            <p className="mt-2 text-slate-600">
              We have received your payment notification.
              Our volunteers will verify your PayNow transaction shortly.
            </p>

            <div className="mt-10 rounded-2xl bg-slate-50 p-6">

              <h2 className="mb-6 text-2xl font-bold">
                Order Details
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span>Ticket Number</span>
                  <strong>{order.ticket_number}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Name</span>
                  <strong>{order.name}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Briyani</span>
                  <strong>{order.quantity}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Amount Paid</span>
                  <strong className="text-xl text-green-700">
                    ${Number(order.amount).toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                    Awaiting Verification
                  </span>
                </div>

              </div>

            </div>

            <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-left">

              <h3 className="mb-3 text-lg font-bold">
                What's Next?
              </h3>

              <ol className="list-decimal space-y-2 pl-5 text-slate-700">
                <li>Our volunteers will verify your PayNow payment.</li>
                <li>Keep your ticket number for briyani collection.</li>
                <li>Please present this ticket when collecting your order.</li>
              </ol>

            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 p-6">

              <h3 className="text-lg font-bold">
                Need Help?
              </h3>

              <p className="mt-3">
                <strong>{settings.contact_name}</strong>
              </p>

              <p>{settings.contact_phone}</p>

              <p>{settings.contact_email}</p>

            </div>

            <Link
              href="/"
              className="mt-10 inline-block rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-green-700"
            >
              Back to Home
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}