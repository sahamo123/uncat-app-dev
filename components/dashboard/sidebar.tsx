'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Link2,
    CreditCard,
    ChevronLeft,
    CheckCircle2,
    PieChart,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/connections", label: "Connections", icon: Link2 },
    { href: "/dashboard/transactions", label: "Transactions", icon: CheckCircle2 },
    { href: "/dashboard/reports", label: "Reports", icon: PieChart },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    return (
        <aside className="w-64 border-r bg-card hidden md:flex flex-col h-screen sticky top-0">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        U
                    </div>
                    Uncat App
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/dashboard" && pathname?.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 mb-1",
                                    isActive && "bg-secondary/50 text-secondary-foreground font-semibold"
                                )}
                            >
                                <Icon className="w-5 h-5 opacity-70" />
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="p-4 border-t bg-muted/20">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <UserButton afterSignOutUrl="/sign-in" />
                    <div className="flex-1 text-sm overflow-hidden">
                        <div className="font-medium truncate text-foreground">
                            {user?.fullName || 'User'}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                        </div>
                    </div>
                    {/* Settings Link */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
