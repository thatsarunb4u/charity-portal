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
                  <button
                    type="button"
                    onClick={() => verifyPayment(order.ticket_number)}
                    disabled={isVerified || isVerifying}
                    className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isVerified ? "Verified" : isVerifying ? "Verifying…" : "Verify payment"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
