"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, HelpCircle, Undo2, X } from "lucide-react";
import { DecisionTree, DecisionNode, Transaction } from "@/types/decision-tree";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface DecisionTreeWizardProps {
    onComplete: (category: string, reasoning: string) => void;
    onCancel: () => void;
    transaction?: Transaction;
}

export function DecisionTreeWizard({ onComplete, onCancel, transaction }: DecisionTreeWizardProps) {
    const [tree, setTree] = useState<DecisionTree | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string>("start");
    const [history, setHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState<'left' | 'right' | 'none'>('none');

    // Animation values for swipe
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
    const cardColor = useTransform(x, [-200, 0, 200], ['rgba(239, 68, 68, 0.1)', 'rgba(255, 255, 255, 1)', 'rgba(34, 197, 94, 0.1)']);

    // Fetch logic
    useEffect(() => {
        async function fetchTree() {
            try {
                const res = await fetch("/api/decision-tree");
                if (!res.ok) throw new Error("Failed to load decision tree");
                const data = await res.json();
                setTree(data);
            } catch (error) {
                console.error("Error loading tree:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTree();
    }, []);

    const handleOptionSelect = (nextNodeId: string, dir: 'left' | 'right' | 'none' = 'none') => {
        setDirection(dir);
        setTimeout(() => {
            setHistory((prev) => [...prev, currentNodeId]);
            setCurrentNodeId(nextNodeId);
            x.set(0);
            setDirection('none');
        }, 200); // Wait for exit animation
    };

    const handleBack = () => {
        const newHistory = [...history];
        const prevNode = newHistory.pop();
        if (prevNode) {
            setHistory(newHistory);
            setCurrentNodeId(prevNode);
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!tree) return;
        const node = tree[currentNodeId];
        if (!node.options || node.options.length !== 2) {
            x.set(0); // Reset if not a binary choice
            return;
        }

        const threshold = 100;
        if (info.offset.x > threshold) {
            // Swiped Right (First option usually 'Yes' or positive)
            handleOptionSelect(node.options[0].nextNodeId, 'right');
        } else if (info.offset.x < -threshold) {
            // Swiped Left (Second option usually 'No' or negative)
            handleOptionSelect(node.options[1].nextNodeId, 'left');
        } else {
            x.set(0);
        }
    };

    if (loading) {
        return (
            <Card className="w-full max-w-md mx-auto h-[500px] flex items-center justify-center border-none shadow-none bg-transparent">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </Card>
        );
    }

    if (!tree) return null;

    const node = tree[currentNodeId];
    const isBinary = node.options?.length === 2;

    // Transaction Card Header
    const renderTransactionInfo = () => {
        if (!transaction) return null;
        return (
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border mb-4 w-full max-w-md mx-auto">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{transaction.date}</p>
                        <h3 className="font-semibold text-sm line-clamp-2">{transaction.description}</h3>
                    </div>
                    <div className={`text-right font-bold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}
                        ${transaction.amount.toFixed(2)}
                    </div>
                </div>
            </div>
        );
    };

    // Terminal Node (Result)
    if (node.category) {
        return (
            <div className="w-full max-w-md mx-auto space-y-4">
                {renderTransactionInfo()}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full"
                >
                    <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-900/10 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                        <CardHeader className="pb-2">
                            <div className="flex justify-center mb-4">
                                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-2xl text-green-700 dark:text-green-400">Match Found!</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4 pb-6">
                            <div>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Category</p>
                                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 py-1">
                                    {node.category}
                                </p>
                            </div>
                            {node.taxNote && (
                                <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm p-4 rounded-xl text-sm border border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-200">
                                    <div className="flex items-center justify-center gap-2 mb-1.5 opacity-80">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="font-semibold text-xs uppercase">Coach's Note</span>
                                    </div>
                                    {node.taxNote}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 pt-2">
                            <Button
                                onClick={() => onComplete(node.category!, `Selected via decision tree path: ${[...history, currentNodeId].join(' -> ')}`)}
                                className="w-full h-12 text-lg font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all"
                            >
                                Confirm Category
                            </Button>
                            <Button variant="ghost" onClick={handleBack} className="w-full text-muted-foreground hover:bg-transparent hover:text-foreground">
                                <Undo2 className="h-4 w-4 mr-2" />
                                Go Back
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Question Card (Swipeable)
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center min-h-[600px] justify-center relative overscroll-none touch-none">
            {/* Actions / Header */}
            <div className="w-full flex justify-between items-center px-2 mb-4 absolute top-0 z-10">
                <Button variant="ghost" size="icon" onClick={onCancel} className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-black">
                    <X className="h-4 w-4" />
                </Button>
                {history.length > 0 && (
                    <Button variant="ghost" size="icon" onClick={handleBack} className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm hover:bg-white dark:hover:bg-black">
                        <Undo2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {renderTransactionInfo()}

            <div className="relative w-full h-[420px]">
                {/* Background Stack Effect */}
                <div className="absolute top-4 left-4 right-4 bottom-0 bg-white/50 dark:bg-slate-800/50 rounded-3xl -z-10 transform scale-95 translate-y-4 shadow-sm border" />
                <div className="absolute top-8 left-8 right-8 bottom-0 bg-white/30 dark:bg-slate-800/30 rounded-3xl -z-20 transform scale-90 translate-y-8 shadow-sm border" />

                <motion.div
                    className="w-full h-full absolute cursor-grab active:cursor-grabbing bg-white dark:bg-slate-950 rounded-3xl shadow-xl border overflow-hidden flex flex-col"
                    style={{ x, rotate, opacity }}
                    drag={isBinary ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    animate={{
                        x: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
                        opacity: direction !== 'none' ? 0 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    whileTap={{ scale: 1.02 }}
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />

                    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                        <div className="mb-6 mt-4">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-3">
                                Step {history.length + 1}
                            </span>
                            <h2 className="text-2xl font-bold leading-tight">{node.question}</h2>
                        </div>

                        {node.taxNote && (
                            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-2xl text-sm leading-relaxed border border-indigo-100 dark:border-indigo-800/50">
                                <div className="flex gap-2 font-semibold mb-1">
                                    <HelpCircle className="h-4 w-4 mt-0.5" />
                                    Tax Tip
                                </div>
                                {node.taxNote}
                            </div>
                        )}

                        <div className="flex-1 flex flex-col justify-end gap-3 pb-2">
                            {/* Render Options */}
                            {node.options?.map((option, idx) => {
                                // Binary choice styling (Swipe hints)
                                if (isBinary) {
                                    const isYes = idx === 0; // Assumption: First option is positive/Right
                                    return (
                                        <Button
                                            key={option.id}
                                            variant={isYes ? "default" : "outline"}
                                            className={`w-full py-6 text-lg rounded-xl shadow-sm ${isYes ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-2'}`}
                                            onClick={() => handleOptionSelect(option.nextNodeId, isYes ? 'right' : 'left')}
                                        >
                                            {option.label}
                                        </Button>
                                    );
                                }

                                // Multi-choice styling
                                return (
                                    <Button
                                        key={option.id}
                                        variant="outline"
                                        className="w-full py-4 h-auto text-left justify-start rounded-xl border hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                                        onClick={() => handleOptionSelect(option.nextNodeId)}
                                    >
                                        <div>
                                            <div className="font-semibold text-base">{option.label}</div>
                                            {option.description && (
                                                <div className="text-xs text-muted-foreground font-normal mt-0.5">{option.description}</div>
                                            )}
                                        </div>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    {/* Swipe Hints Overlay */}
                    {isBinary && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-8 pointer-events-none opacity-40 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <div className="flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Swipe Left</div>
                            <div className="flex items-center gap-1">Swipe Right <ArrowLeft className="h-3 w-3 rotate-180" /></div>
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground">
                {history.length > 0 ? (
                    <button onClick={handleBack} className="hover:text-foreground underline decoration-dashed underline-offset-4">
                        Mistake? Undo last step
                    </button>
                ) : (
                    <span className="opacity-50">Swipe cards or tap options to categorize</span>
                )}
            </div>
        </div>
    );
}
