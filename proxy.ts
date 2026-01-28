import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextFetchEvent } from "next/server";

export default async function proxy(req: NextRequest, event: NextFetchEvent) {
    // Manual matcher logic for Next.js 16 proxy
    const { pathname } = req.nextUrl;
    
    // Always run for API and protected routes
    const isPublicPath = 
        pathname === "/" || 
        pathname === "/pricing" ||
        pathname.startsWith("/sign-in") || 
        pathname.startsWith("/sign-up") ||
        pathname.match(/\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/);

    if (isPublicPath) {
        return;
    }

    return clerkMiddleware(req, event);
}
