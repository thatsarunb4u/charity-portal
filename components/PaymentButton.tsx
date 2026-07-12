"use client";

export default function PaymentButton({
    ticket,
}: {
    ticket: string;
}) {

    async function submit() {

        const response = await fetch("/api/payment-submitted", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                ticket,
            }),

        });

        const data = await response.json();

        if (data.success) {

            window.location.href = "/thank-you/" + ticket;

        } else {

            alert("Unable to update payment status.");

        }

    }

    return (
    <button
        type="button"
        onClick={submit}
        className="
            w-full
            rounded-xl
            bg-green-600
            py-4
            text-lg
            font-bold
            text-white
            transition
            hover:bg-green-700
            disabled:bg-gray-400
        "
    >
        ✓ I've Completed Payment
    </button>
);

}