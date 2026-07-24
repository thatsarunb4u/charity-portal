"use client";

import { useMemo, useState } from "react";

type OrderFormProps = {
    unitPrice: number;
};

export default function OrderForm({ unitPrice }: OrderFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [orderOption, setOrderOption] = useState("");
    const [contactConsent, setContactConsent] = useState<boolean | null>(null);
    const [qty, setQty] = useState(1);

    const total = useMemo(() => {
        return qty * Number(unitPrice || 0);
    }, [qty, unitPrice]);

    const [loading, setLoading] = useState(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

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
                    dining_option: orderOption,
                    contact_consent: contactConsent,
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

                Order Coupon

            </h2>

            <form className="space-y-5" onSubmit={submit}>

                <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                <input
                    className="w-full rounded-xl border p-3"
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <fieldset>
                    <legend className="mb-2 font-medium">Order preference</legend>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dining-option"
                                value="collect_for_self"
                                checked={orderOption === "collect_for_self"}
                                onChange={(e) => setOrderOption(e.target.value)}
                                required
                            />
                            Collect for self
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dining-option"
                                value="donate"
                                checked={orderOption === "donate"}
                                onChange={(e) => setOrderOption(e.target.value)}
                            />
                            Donate
                        </label>
                    </div>
                </fieldset>

                <section
                    aria-labelledby="contact-consent-heading"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                    <h3 id="contact-consent-heading" className="font-semibold">
                        Stay connected
                    </h3>
                    <label className="mt-3 flex items-start gap-3 text-sm text-slate-700">
                        <input
                            type="radio"
                            name="contact-consent"
                            checked={contactConsent === true}
                            onChange={() => setContactConsent(true)}
                            required
                            className="mt-1"
                        />
                        <span>
                            I consent to the masjid retaining my contact details and
                            contacting me about future activities.
                        </span>
                    </label>
                    <label className="mt-3 flex items-start gap-3 text-sm text-slate-700">
                        <input
                            type="radio"
                            name="contact-consent"
                            checked={contactConsent === false}
                            onChange={() => setContactConsent(false)}
                            className="mt-1"
                        />
                        <span>I do not consent.</span>
                    </label>
                </section>

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

                <section
                    aria-labelledby="terms-heading"
                    className="rounded-xl border border-slate-200 p-4 text-sm text-slate-700"
                >
                    <h3 id="terms-heading" className="font-semibold text-slate-900">
                        Terms &amp; Conditions
                    </h3>
                    <ul className="mt-3 list-disc space-y-1 pl-5">
                        <li>Orders are subject to availability.</li>
                        <li>If you selected collect for self, keep your ticket number and present it when collecting your order.</li>
                        <li>Verify the PayNow amount and payment reference before confirming payment.</li>
                        <li>Contact the masjid if you need help with your order.</li>
                    </ul>
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-green-600 py-4 text-xl font-bold text-white disabled:bg-gray-400 hover:bg-green-700"
                >
                    {loading ? "Generating..." : "Generate PayNow QR"}
                </button>

            </form>

        </div>

    )

}
