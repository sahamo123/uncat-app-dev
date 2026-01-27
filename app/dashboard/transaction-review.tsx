'use client';

import { useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

interface Transaction {
    id: string;
    payee_name: string;
    description: string;
    amount: number;
    transaction_date: string;
    ai_suggested_account_id: string;
    ai_confidence_score: number;
    ai_reasoning: string;
    suggested_account_name?: string; // We'll need to join this in the fetch
}

interface Props {
    transactions: Transaction[];
    accounts: { id: string, name: string }[];
}

export default function TransactionReview({ transactions: initialTransactions, accounts }: Props) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [loading, setLoading] = useState<string | null>(null);

    const handleApprove = async (txn: Transaction) => {
        setLoading(txn.id);
        try {
            const res = await fetch('/api/review', {
                method: 'POST',
                body: JSON.stringify({
                    transactionId: txn.id,
                    action: 'approve',
                    accountId: txn.ai_suggested_account_id
                })
            });

            if (!res.ok) throw new Error('Failed to approve');

            // Optimistic update: remove from list
            setTransactions(prev => prev.filter(t => t.id !== txn.id));
        } catch (error) {
            console.error(error);
            alert("Failed to approve transaction");
        } finally {
            setLoading(null);
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">All caught up!</h3>
                <p className="text-zinc-500 dark:text-zinc-400">No pending transactions to review.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map(txn => (
                <div key={txn.id} className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{txn.payee_name || 'Unknown Payee'}</h4>
                                <span className={`text-sm font-medium ${txn.amount < 0 ? 'text-green-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                    ${Number(txn.amount).toFixed(2)}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{txn.description}</p>
                            <p className="text-xs text-zinc-400">{new Date(txn.transaction_date).toLocaleDateString()}</p>
                        </div>

                        <div className="w-full sm:w-1/3 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-100 dark:border-blue-800/30">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">AI Suggestion</span>
                                {txn.ai_confidence_score < 0.7 && (
                                    <span className="flex items-center gap-1 text-xs text-amber-600" title="Low confidence">
                                        <AlertCircle className="w-3 h-3" /> Low Confidence
                                    </span>
                                )}
                            </div>
                            <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                {txn.suggested_account_name || 'Unknown Account'}
                            </div>
                            <p className="text-xs text-blue-700 dark:text-blue-300 italic">"{txn.ai_reasoning}"</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleApprove(txn)}
                                disabled={loading === txn.id}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                            >
                                {loading === txn.id ? 'Saving...' : (
                                    <>
                                        <Check className="w-4 h-4" /> Approve
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
