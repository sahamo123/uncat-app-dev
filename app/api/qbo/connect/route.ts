import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getQBOClient } from '@/lib/quickbooks';
import OAuthClient from 'intuit-oauth';

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const oauthClient = getQBOClient();

        const authUri = oauthClient.authorizeUri({
            scope: [
                OAuthClient.scopes.Accounting,
                OAuthClient.scopes.OpenId,
                OAuthClient.scopes.Profile,
                OAuthClient.scopes.Email
            ],
            state: userId,
        });

        return NextResponse.redirect(authUri);

    } catch (error: any) {
        console.error("Failed to generate QBO auth URL:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
