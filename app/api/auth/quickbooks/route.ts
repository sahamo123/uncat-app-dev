import { NextResponse } from 'next/server';
import { getQBOClient } from '@/lib/quickbooks';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const oauthClient = getQBOClient();

    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
        state: userId, // Pass userId as state to retrieve it in callback
    });

    return NextResponse.redirect(authUri);
}
