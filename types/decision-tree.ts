export type DecisionNodeType = 'choice' | 'text_input' | 'date_input' | 'currency_input';

export interface DecisionOption {
    id: string;
    label: string;
    nextNodeId: string; // The ID of the node this option leads to
    description?: string; // Optional helper text for the option
}

export interface DecisionNode {
    id: string;
    question: string;
    type: DecisionNodeType;
    options?: DecisionOption[]; // Required for 'choice' type
    category?: string; // If present, this is a terminal node that assigns this category
    confidence?: number; // AI confidence level for this category (0-1)
    taxNote?: string; // Educational note about deductibility
    flagFor1099?: boolean; // If true, reaching this node flags the vendor for 1099 review
}

export type DecisionTree = Record<string, DecisionNode>;

export interface TreeHistoryItem {
    nodeId: string;
    selectedOptionId?: string;
    inputValue?: string;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    type: 'deposit' | 'withdrawal';
}
