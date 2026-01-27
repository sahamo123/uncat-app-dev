import { NextResponse } from 'next/server';
import { loadDecisionTree } from '@/lib/ai/decision-tree';

export async function GET() {
    try {
        const tree = await loadDecisionTree();
        return NextResponse.json(tree);
    } catch (error) {
        console.error("Failed to load decision tree:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
