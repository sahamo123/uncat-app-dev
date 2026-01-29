'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time insights into your business performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        This Month
                    </Button>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345.00</div>
                        <p className="text-xs text-muted-foreground">
                            +4.5% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$32,886.89</div>
                        <p className="text-xs text-muted-foreground">
                            +28.4% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Mock Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue vs Expenses</CardTitle>
                        <CardDescription>
                            Comparative view for the last 6 months.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between gap-2 px-6 pb-6">
                        {/* CSS-only Bar Chart Mockup */}
                        {[60, 45, 70, 50, 80, 90].map((h, i) => (
                            <div key={i} className="flex flex-col justify-end items-center gap-2 w-full h-full group">
                                <div className="w-full max-w-[40px] flex items-end gap-1 h-full">
                                    <div style={{ height: `${h}%` }} className="w-1/2 bg-primary rounded-t-sm transition-all group-hover:bg-primary/80"></div>
                                    <div style={{ height: `${h * 0.6}%` }} className="w-1/2 bg-muted-foreground/30 rounded-t-sm transition-all group-hover:bg-muted-foreground/50"></div>
                                </div>
                                <span className="text-[10px] text-muted-foreground uppercase">
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                        <CardDescription>Top spending categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {[
                            { name: "Software & Subscriptions", val: 45, color: "bg-blue-500" },
                            { name: "Office Supplies", val: 20, color: "bg-indigo-500" },
                            { name: "Travel & Meals", val: 15, color: "bg-purple-500" },
                            { name: "Contractors", val: 10, color: "bg-pink-500" },
                            { name: "Other", val: 10, color: "bg-zinc-500" }
                        ].map((item) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-muted-foreground">{item.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div style={{ width: `${item.val}%` }} className={`h-full ${item.color}`} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
