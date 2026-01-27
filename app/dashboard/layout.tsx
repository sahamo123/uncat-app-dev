import { Sidebar } from "@/components/dashboard/sidebar";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 border-b flex items-center justify-between px-4 md:hidden bg-card">
                    <span className="font-bold text-primary">Uncat App</span>
                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/sign-in" />
                        <Button variant="ghost" size="icon">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-muted/10 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
