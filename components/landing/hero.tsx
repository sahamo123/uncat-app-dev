import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden bg-background">
            <div className="container px-4 mx-auto relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Sparkles className="w-4 h-4" />
                    <span>New: AI-Powered Uncategorization Engine</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Bookkeeping on <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Autopilot
                    </span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    DaxHive uses AI to automatically categorize transactions, manage receipts, and close your books 10x faster. Built for modern accounting firms.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Link href="/sign-up">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2">
                            Start Free Trial <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                            View Demo
                        </Button>
                    </Link>
                </div>

                {/* Hero Image Mockup */}
                <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in zoom-in duration-1000 delay-500">
                    <div className="rounded-xl border bg-background/50 backdrop-blur-xl shadow-2xl p-2">
                        <div className="rounded-lg bg-zinc-100 dark:bg-zinc-900 overflow-hidden aspect-[16/9] relative">
                            {/* Placeholder for App Screenshot */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-2xl">
                                App Interface Preview
                            </div>
                        </div>
                    </div>
                    {/* Decorative Gradients */}
                    <div className="absolute -top-24 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px] -z-10" />
                    <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-[100px] -z-10" />
                </div>
            </div>
        </section>
    );
}
