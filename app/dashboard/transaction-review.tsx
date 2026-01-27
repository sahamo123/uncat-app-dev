'use client';

import { useState } from 'react';
import { Check, X, Sparkles, HelpCircle, ArrowRight, AlertCircle } from 'lucide-react';
import DecisionTreeWizard from './decision-tree-wizard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Transaction {
    id: string;
    payee_name: string;
    description: string;
    amount: number;
    transaction_date: string;
    ai_suggested_account_id: string;
    ai_confidence_score: number;
    ai_reasoning: string;
    suggested_account_name?: string;
}

interface Props {
    transactions: Transaction[];
    accounts: { id: string, name: string }[];
}

export default function TransactionReview({ transactions: initialTransactions, accounts }: Props) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [loading, setLoading] = useState<string | null>(null);
    const [wizardTxn, setWizardTxn] = useState<Transaction | null>(null);
    const router = useRouter();

    const handleApprove = async (txn: Transaction, accountId?: string, reasoning?: string) => {
        setLoading(txn.id);
        try {
            const res = await fetch('/api/review', {
                method: 'POST',
                body: JSON.stringify({
                    transactionId: txn.id,
                    action: 'approve',
                    accountId: accountId || txn.ai_suggested_account_id,
                    reasoning: reasoning || txn.ai_reasoning
                })
            });

            if (!res.ok) throw new Error('Failed to approve');

            // Optimistic update: remove from list
            setTransactions(prev => prev.filter(t => t.id !== txn.id));
            setWizardTxn(null);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to approve transaction");
        } finally {
            setLoading(null);
        }
    };

    const handleWizardComplete = async (categoryName: string, reasoning: string, confidence: number) => {
        if (!wizardTxn) return;

        // Find matched account
        const matchedAccount = accounts.find(a => a.name.toLowerCase() === categoryName.toLowerCase());

        if (matchedAccount) {
            await handleApprove(wizardTxn, matchedAccount.id, reasoning);
        } else {
            // In a real app, we might create a new account here
            alert(`Category "${categoryName}" not found in your Chart of Accounts. Please create it first.`);
            setWizardTxn(null);
        }
    };

    // Empty State
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl bg-muted/10 animate-in fade-in zoom-in-50 duration-500">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    You've reviewed all pending transactions. Great job keeping your books clean!
                </p>
                <div className="mt-8">
                    <Button variant="outline" onClick={() => router.refresh()}>Refresh List</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Wizard Modal */}
            {wizardTxn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <DecisionTreeWizard
                        onCancel={() => setWizardTxn(null)}
                        onComplete={handleWizardComplete}
                    />
                </div>
            )}

            {transactions.map(txn => {
                const isHighConfidence = txn.ai_confidence_score > 0.8;
                return (
                    <Card key={txn.id} className="overflow-hidden transition-all hover:shadow-lg border-l-4 border-l-primary group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/5">
                            <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {txn.payee_name || 'Unknown Payee'}
                                </CardTitle>
                                <div className="text-xs text-muted-foreground font-mono">
                                    {new Date(txn.transaction_date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className={cn("text-lg font-bold font-mono", txn.amount < 0 ? "text-green-600" : "")}>
                                ${Number(txn.amount).toFixed(2)}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6 relative">
                            {/* AI Brain */}
                            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 relative">
                                <div className="absolute -top-3 -right-3 bg-background border rounded-full p-1.5 shadow-sm text-primary">
                                    <Sparkles className="w-4 h-4" />
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Suggestion</span>
                                    <Badge variant={isHighConfidence ? "default" : "warning"} className="text-[10px] px-2 h-5">
                                        {Math.round(txn.ai_confidence_score * 100)}% Match
                                    </Badge>
                                </div>
                                <div className="text-xl font-medium text-primary mb-2">
                                    {txn.suggested_account_name || 'Unknown Account'}
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    "{txn.ai_reasoning}"
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-muted/5 p-4 flex gap-3 justify-end items-center">
                            <div className="mr-auto text-xs text-muted-foreground hidden sm:block">
                                {txn.description}
                            </div>

                            <Button variant="outline" size="sm" onClick={() => setWizardTxn(txn)}>
                                <HelpCircle className="w-4 h-4 mr-2" />
                                Help Me
                            </Button>

                            <Button
                                onClick={() => handleApprove(txn)}
                                disabled={loading === txn.id}
                                className="min-w-[120px]"
                            >
                                {loading === txn.id ? 'Saving...' : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> Approve
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
