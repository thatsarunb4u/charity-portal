"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminOrder = {
  id: number;
  ticket_number: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  amount: number | string;
  dining_option: "collect_for_self" | "donate";
  status: string | null;
};

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  return digits.length === 8 ? `65${digits}` : digits;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.478-.883-.788-1.479-1.761-1.652-2.058-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.496.099-.198.05-.372-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479s1.064 2.876 1.213 3.074c.148.198 2.095 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.005a9.868 9.868 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.375a9.868 9.868 0 01-1.51-5.26c.001-5.446 4.432-9.877 9.88-9.877 2.64 0 5.122 1.028 6.988 2.892a9.868 9.868 0 012.886 6.994c-.003 5.447-4.434 9.878-9.89 9.878m8.395-18.265A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.097.549 4.146 1.59 5.951L0 24l6.335-1.662a11.86 11.86 0 005.709 1.454h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.497-8.399Z" />
    </svg>
  );
}

export default function AdminOrdersTable({ orders, accessToken }: { orders: AdminOrder[]; accessToken: string }) {
  const router = useRouter();
  const [verifyingTicket, setVerifyingTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function verifyPayment(ticket: string) {
    setError(null);
    setVerifyingTicket(ticket);

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(ticket)}/verify`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to verify this payment.");
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to verify this payment."
      );
    } finally {
      setVerifyingTicket(null);
    }
  }

  function sendWhatsAppConfirmation(order: AdminOrder) {
    const phone = whatsappNumber(order.phone);

    if (!phone) {
      setError(`No valid phone number is available for order ${order.ticket_number}.`);
      return;
    }

    const couponLabel = `${order.quantity} Nasi Minyak Ayam Korma coupon${order.quantity === 1 ? "" : "s"}`;
    const collectionPreference = order.dining_option === "collect_for_self" ? "Collect for self" : "Donate";
    const collectionDetails = order.dining_option === "collect_for_self"
      ? [
          "",
          "Collection details:",
          "Time: 6:00 PM to 9:30 PM",
          "Location: Istana Ballroom",
          "",
          "Please bring this confirmation when collecting your order.",
        ]
      : [];
    const message = [
      `Hello ${order.name},`,
      "",
      "Your order has been confirmed.",
      "",
      "Order details:",
      `Booking ID: ${order.ticket_number}`,
      couponLabel,
      `Amount paid: $${Number(order.amount).toFixed(2)}`,
      `Order preference: ${collectionPreference}`,
      ...collectionDetails,
      "",
      "Thank you for supporting our charity event.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")?.focus();
  }

  if (orders.length === 0) {
    return <p className="p-6 text-slate-600">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      {error && (
        <p className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="border-b bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Ticket</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Order</th>
            <th className="px-4 py-3 font-semibold">Amount</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {orders.map((order) => {
            const isVerified = order.status === "Payment Verified";
            const isVerifying = verifyingTicket === order.ticket_number;

            return (
              <tr key={order.id} className="align-top hover:bg-slate-50">
                <td className="px-4 py-4 font-semibold text-slate-900">{order.ticket_number}</td>
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">{order.name}</p>
                  <p className="mt-1 text-slate-600">{order.email}</p>
                  <p className="text-slate-600">{order.phone}</p>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  <p>{order.quantity} coupon{order.quantity === 1 ? "" : "s"}</p>
                  <p className="mt-1 capitalize">{order.dining_option?.replaceAll("_", " ")}</p>
                </td>
                <td className="px-4 py-4 font-medium text-slate-900">${Number(order.amount).toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={isVerified ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800" : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"}>
                    {order.status || "Payment pending"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => verifyPayment(order.ticket_number)}
                      disabled={isVerified || isVerifying}
                      className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isVerified ? "Verified" : isVerifying ? "Verifying…" : "Verify payment"}
                    </button>
                    <button
                      type="button"
                      onClick={() => sendWhatsAppConfirmation(order)}
                      aria-label={`Send WhatsApp confirmation to ${order.name}`}
                      title="Send WhatsApp confirmation"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white hover:bg-[#1da851]"
                    >
                      <WhatsAppIcon />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
