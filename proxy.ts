import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";

export default async function proxy(req: NextRequest, event: NextFetchEvent) {
    const { pathname } = req.nextUrl;

    // LOG EVERYTHING to debug 404
    console.log(`PROXY_HIT: ${req.method} ${pathname}`);

    // 1. Skip static assets and internal Next.js paths
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('favicon.ico') ||
        pathname.match(/\.(?:css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/)
    ) {
        return NextResponse.next();
    }

    try {
        const res = await clerkMiddleware()(req, event);
        console.log(`CLERK_RES: ${pathname} -> ${res?.status || 'no-res'}`);
        return res || NextResponse.next();
    } catch (error) {
        console.error("Clerk Middleware Error:", error);
        return NextResponse.next();
    }
}
