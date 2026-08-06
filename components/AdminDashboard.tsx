"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminOrdersTable, { type AdminOrder } from "@/components/AdminOrdersTable";
import { supabase } from "@/lib/supabase";

type ViewState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; orders: AdminOrder[]; accessToken: string };

export default function AdminDashboard() {
  const router = useRouter();
  const [state, setState] = useState<ViewState>({ kind: "loading" });

  useEffect(() => {
    async function loadOrders() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        setState({
          kind: "error",
          message: data.error ?? "Unable to load the admin portal.",
        });
        return;
      }

      setState({
        kind: "ready",
        orders: data.orders,
        accessToken: session.access_token,
      });
    }

    void loadOrders();
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (state.kind === "loading") {
    return <p className="p-8 text-slate-600">Loading admin portal…</p>;
  }

  if (state.kind === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
        <h2 className="font-bold">Access unavailable</h2>
        <p className="mt-1">{state.message}</p>
        <button type="button" onClick={signOut} className="mt-4 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white">Sign out</button>
      </div>
    );
  }

  const paymentSubmitted = state.orders.filter((order) => order.status === "Payment Submitted").length;
  const paymentVerified = state.orders.filter((order) => order.status === "Payment Verified").length;

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Administrator portal</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Order management</h1>
          <p className="mt-2 text-slate-600">Review PayNow submissions and mark received payments as verified.</p>
        </div>
        <button type="button" onClick={signOut} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign out</button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-3" aria-label="Order summary">
        <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">All orders</p><p className="mt-1 text-3xl font-bold">{state.orders.length}</p></div>
        <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">Awaiting verification</p><p className="mt-1 text-3xl font-bold text-amber-600">{paymentSubmitted}</p></div>
        <div className="rounded-xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">Payment verified</p><p className="mt-1 text-3xl font-bold text-green-700">{paymentVerified}</p></div>
      </section>

      <section className="overflow-hidden rounded-xl bg-white shadow-sm">
        <AdminOrdersTable orders={state.orders} accessToken={state.accessToken} />
      </section>
    </>
  );
}
