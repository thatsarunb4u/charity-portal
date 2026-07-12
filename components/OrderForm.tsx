"use client";

import { useMemo, useState } from "react";

type OrderFormProps = {
    unitPrice: number;
};

export default function OrderForm({ unitPrice }: OrderFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [qty, setQty] = useState(1);

    const total = useMemo(() => {
        return qty * Number(unitPrice || 0);
    }, [qty, unitPrice]);

    const [loading, setLoading] = useState(false);

    async function submit() {
        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    quantity: qty,
                }),
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = "/pay/" + data.ticket;
                return;
            }

            alert(data.error ?? "Unable to create order.");
        } finally {
            setLoading(false);
        }
    }

    return (

        <div
            className="
rounded-2xl
bg-white
shadow-lg
border
border-slate-200
p-8
">

            <h2
                className="
text-3xl
font-bold
mb-6
"
            >

                Order Briyani

            </h2>

            <div className="space-y-5">

                <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div>

                    <label>

                        Quantity

                    </label>

                    <div className="mt-2 flex items-center gap-4">

                        <button
                            type="button"
                            className="h-10 w-10 rounded-full bg-slate-700 text-white text-xl"
                            onClick={() => setQty(Math.max(1, qty - 1))}
                        >
                            −
                        </button>

                        <span className="text-3xl font-bold w-12 text-center">
                            {qty}
                        </span>

                        <button
                            type="button"
                            className="h-10 w-10 rounded-full bg-slate-700 text-white text-xl"
                            onClick={() => setQty(qty + 1)}
                        >
                            +
                        </button>

                    </div>

                </div>

                <div
                    className="
rounded-xl
bg-slate-100
p-5
"
                >

                    <div
                        className="
flex
justify-between
"
                    >

                        <span>

                            Total

                        </span>

                        <span
                            className="
text-3xl
font-bold
"
                        >

                            ${total.toFixed(2)}

                        </span>

                    </div>

                </div>

                <button
                    disabled={loading}
                    className="w-full rounded-xl bg-green-600 py-4 text-xl font-bold text-white disabled:bg-gray-400 hover:bg-green-700"
                    onClick={submit}
                >
                    {loading ? "Generating..." : "Generate PayNow QR"}
                </button>

            </div>

        </div>

    )

}