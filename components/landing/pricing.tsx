import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Pricing() {
    return (
        <section id="pricing" className="py-24">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Start for free, upgrade as you scale. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Starter Plan */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-2xl">Starter</CardTitle>
                            <CardDescription>For freelance accountants</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 User</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1 Connected Tenant</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic AI Rules</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="flex flex-col border-primary shadow-lg relative">
                        <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                            POPULAR
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl">Pro</CardTitle>
                            <CardDescription>For growing firms</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$49</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 5 Team Members</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Tenants</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced AI logic</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Start Free Trial</Button>
                        </CardFooter>
                    </Card>

                    {/* Enterprise Plan */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-2xl">Enterprise</CardTitle>
                            <CardDescription>For large organizations</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">$199</span>
                                <span className="text-muted-foreground">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Users</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Custom Integrations</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Dedicated Account Manager</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> White Labeling</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
