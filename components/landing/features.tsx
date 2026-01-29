import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Zap, ShieldCheck, PieChart } from "lucide-react";

const features = [
    {
        title: "AI Uncategorization Engine",
        description: "Our RAG-powered engine learns from your history to categorize transactions with 95% accuracy.",
        icon: BrainCircuit,
    },
    {
        title: "Real-time Sync",
        description: "Connects directly to QuickBooks Online. Changes are synced instantly in both directions.",
        icon: Zap,
    },
    {
        title: "Audit-Proof Documentation",
        description: "Every decision is logged. Receipts are OCR-scanned and attached to the transaction automatically.",
        icon: ShieldCheck,
    },
    {
        title: "Practice-Level Reporting",
        description: "See the health of all your clients in one dashboard. Track revenue, efficiency, and outstanding tasks.",
        icon: PieChart,
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 bg-muted/50">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Everything you need to close the books
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Built by accountants, for accountants. We automate the busy work so you can focus on advisory.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <Card key={feature.title} className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base text-muted-foreground">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
