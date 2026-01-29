"use client";

import { DecisionTreeWizard } from '@/components/decision-tree/DecisionTreeWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function DecisionTreeTestPage() {
    const [result, setResult] = useState<string | null>(null);

    const handleComplete = (category: string, reasoning: string) => {
        setResult(`Category: ${category}\nReasoning: ${reasoning}`);
    };

    const handleCancel = () => {
        setResult('Wizard Cancelled');
    };

    const mockTransaction = {
        id: "txn_123",
        date: "Jan 26, 2025",
        amount: 156.78,
        description: "KBBQ HOUSE LOS ANGELES CA - Business Dinner with Client",
        type: "withdrawal" as const,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
            {result ? (
                <Card className="max-w-md w-full mx-auto shadow-2xl">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-center">Wizard Completed</h2>
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl whitespace-pre-wrap font-mono text-sm border-l-4 border-green-500">
                            {result}
                        </div>
                        <Button
                            onClick={() => setResult(null)}
                            className="w-full"
                            variant="outline"
                        >
                            Categorize Another
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <DecisionTreeWizard
                    onComplete={handleComplete}
                    onCancel={handleCancel}
                    transaction={mockTransaction}
                />
            )}
        </div>
    );
}
