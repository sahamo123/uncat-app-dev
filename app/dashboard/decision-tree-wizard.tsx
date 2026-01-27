'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { DecisionTree, DecisionNode, DecisionOption } from '@/lib/ai/decision-tree';

interface Props {
    onComplete: (category: string, reasoning: string, confidence: number) => void;
    onCancel: () => void;
}

export default function DecisionTreeWizard({ onComplete, onCancel }: Props) {
    const [tree, setTree] = useState<DecisionTree | null>(null);
    const [history, setHistory] = useState<string[]>([]); // Stack of node keys
    const [currentNodeKey, setCurrentNodeKey] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/decision-tree')
            .then(res => res.json())
            .then((data: DecisionTree) => {
                setTree(data);
                setCurrentNodeKey(data.rootNode);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleOptionSelect = (option: DecisionOption) => {
        // 1. Is it a terminal choice? (Has category)
        if (option.category) {
            const reasoning = `Decision Tree Path: ${option.label}`;
            onComplete(option.category, reasoning, option.confidence || 1.0);
            return;
        }

        // 2. Is it a navigation choice? (Has next)
        if (option.next) {
            setHistory(prev => [...prev, currentNodeKey]);
            setCurrentNodeKey(option.next);
        }
    };

    const handleBack = () => {
        if (history.length === 0) {
            onCancel();
            return;
        }
        const prev = [...history];
        const lastNode = prev.pop();
        setHistory(prev);
        if (lastNode) setCurrentNodeKey(lastNode);
    };

    if (loading) return <div className="p-8 text-center">Loading decision logic...</div>;
    if (!tree) return <div className="p-8 text-center text-red-500">Failed to load decision tree.</div>;

    const currentNode = tree.nodes[currentNodeKey];

    if (!currentNode) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="w-6 h-6 mb-2" />
                Error: Node "{currentNodeKey}" not found in tree.
                <button onClick={handleBack} className="block mt-4 text-sm underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-lg w-full mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-zinc-50 dark:bg-zinc-950 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {history.length === 0 ? 'Cancel' : 'Back'}
                </button>
                <div className="text-xs font-mono text-zinc-400">
                    Step {history.length + 1}
                </div>
            </div>

            {/* Question Body */}
            <div className="p-8">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6 leading-relaxed">
                    {currentNode.question}
                </h3>

                <div className="space-y-3">
                    {currentNode.options?.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(opt)}
                            className="w-full text-left px-5 py-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                    {opt.label}
                                </span>
                                {opt.category && (
                                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                        Finish
                                    </span>
                                )}
                            </div>
                            {opt.taxNote && (
                                <p className="text-xs text-zinc-400 mt-1 italic">
                                    ℹ️ {opt.taxNote}
                                </p>
                            )}
                        </button>
                    ))}

                    {currentNode.type === 'text_input' && (
                        <div className="text-zinc-500 italic text-center py-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg">
                            (Text input support coming in v2)
                            <button
                                onClick={() => onComplete("Other Expenses", "User defined description", 0.7)}
                                className="block mx-auto mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            >
                                Continue manually
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-zinc-100 dark:bg-zinc-800 w-full">
                <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${Math.min((history.length + 1) * 20, 100)}%` }}
                />
            </div>
        </div>
    );
}
