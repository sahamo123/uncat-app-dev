"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function PricingPage() {
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceId: "price_1Pqw...", // Placeholder: User will need to replace this
                }),
            });

            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
            <div className="mx-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                    Pro Plan
                </h2>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                    Everything you need to automate your bookkeeping.
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                        $29
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                        /month
                    </span>
                </div>

                <ul className="mt-8 space-y-4">
                    {["Unlimited Transactions", "AI Categorization", "QuickBooks Sync"].map(
                        (feature) => (
                            <li key={feature} className="flex gap-3">
                                <Check className="h-5 w-5 flex-shrink-0 text-indigo-600" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {feature}
                                </span>
                            </li>
                        )
                    )}
                </ul>

                <button
                    onClick={onSubscribe}
                    disabled={loading}
                    className="mt-8 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Subscribe"}
                </button>
            </div>
        </div>
    );
}
