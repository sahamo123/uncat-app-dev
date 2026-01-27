import { promises as fs } from 'fs';
import path from 'path';

export interface DecisionNode {
    question?: string;
    type?: 'choice' | 'text_input';
    options?: DecisionOption[];
    // For terminal nodes or direct assignments
    category?: string;
    confidence?: number;
    taxNote?: string;
    instruction?: string;
    flagFor1099?: boolean;
}

export interface DecisionOption {
    label: string;
    next?: string; // Key of the next node
    category?: string; // Terminal category
    confidence?: number;
    taxNote?: string;
    instruction?: string;
    flagFor1099?: boolean;
}

export interface DecisionTree {
    rootNode: string;
    nodes: Record<string, DecisionNode>;
}

// In production, we might load this into memory once or fetch from DB
export async function loadDecisionTree(): Promise<DecisionTree> {
    const filePath = path.join(process.cwd(), 'docs', 'ai', 'decision_tree_logic.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}
