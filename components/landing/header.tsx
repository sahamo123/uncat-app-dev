import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="container px-4 h-16 flex items-center justify-between mx-auto">
                <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span>DaxHive</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                    <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                    <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Link href="/dashboard">
                            <Button size="sm" variant="ghost">Dashboard</Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/sign-in">
                            <Button size="sm" variant="ghost">Sign In</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
}
