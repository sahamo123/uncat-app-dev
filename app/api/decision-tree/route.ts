import { NextResponse } from 'next/server';
import { DecisionTree } from '@/types/decision-tree';

const initialTree: DecisionTree = {
    start: {
        id: 'start',
        question: 'What is this transaction for?',
        type: 'choice',
        options: [
            { id: 'opt_meal', label: 'Meal / Food', nextNodeId: 'meal_type' },
            { id: 'opt_travel', label: 'Travel', nextNodeId: 'travel_purpose' },
            { id: 'opt_software', label: 'Software / Subscription', nextNodeId: 'software_usage' },
            { id: 'opt_office', label: 'Office Supply', nextNodeId: 'office_type' },
        ],
    },
    meal_type: {
        id: 'meal_type',
        question: 'Who was at the meal?',
        type: 'choice',
        taxNote: 'Business meals are generally 50% deductible if a client was present.',
        options: [
            { id: 'opt_solo', label: 'Just me (while traveling)', nextNodeId: 'end_travel_meal' },
            { id: 'opt_client', label: 'With a Client / Prospect', nextNodeId: 'end_business_meal' },
            { id: 'opt_team', label: 'With Team / Employees', nextNodeId: 'end_team_meal' },
            { id: 'opt_personal', label: 'Personal (Non-deductible)', nextNodeId: 'end_personal' },
        ],
    },
    travel_purpose: {
        id: 'travel_purpose',
        question: 'Was this travel for a specific client project?',
        type: 'choice',
        options: [
            { id: 'opt_billable', label: 'Yes, billable to client', nextNodeId: 'end_billable_travel' },
            { id: 'opt_general', label: 'No, general business travel', nextNodeId: 'end_travel' },
        ],
    },
    software_usage: {
        id: 'software_usage',
        question: 'Is this software used exclusively for business?',
        type: 'choice',
        options: [
            { id: 'opt_exclusive', label: 'Yes, 100% Business', nextNodeId: 'end_software' },
            { id: 'opt_hybrid', label: 'Mixed Business/Personal', nextNodeId: 'end_ask_percentage' },
        ],
    },
    office_type: {
        id: 'office_type',
        question: 'Is this a depreciable asset (computer, furniture) or a consumable (paper, pens)?',
        type: 'choice',
        options: [
            { id: 'opt_asset', label: 'Asset (> $2,500)', nextNodeId: 'end_asset' },
            { id: 'opt_consumable', label: 'Consumable / Small Equipment', nextNodeId: 'end_office_expense' },
        ],
    },
    // TERMINAL NODES
    end_business_meal: {
        id: 'end_business_meal',
        question: 'Categorized',
        type: 'choice',
        category: 'Meals & Entertainment',
        confidence: 0.9,
        taxNote: '50% Deductible',
    },
    end_team_meal: {
        id: 'end_team_meal',
        question: 'Categorized',
        type: 'choice',
        category: 'Team Building / Staff Welfare',
        confidence: 0.95,
        taxNote: '100% Deductible',
    },
    end_travel_meal: {
        id: 'end_travel_meal',
        question: 'Categorized',
        type: 'choice',
        category: 'Travel Options',
        confidence: 0.85,
    },
    end_personal: {
        id: 'end_personal',
        question: 'Categorized',
        type: 'choice',
        category: 'Owner\'s Draw / Personal',
        confidence: 1.0,
        taxNote: 'Not Deductible',
    },
    end_travel: {
        id: 'end_travel',
        question: 'Categorized',
        type: 'choice',
        category: 'Travel',
        confidence: 0.9,
    },
    end_billable_travel: {
        id: 'end_billable_travel',
        question: 'Categorized',
        type: 'choice',
        category: 'Billable Expense Income',
        confidence: 0.9,
    },
    end_software: {
        id: 'end_software',
        question: 'Categorized',
        type: 'choice',
        category: 'Software & Subscriptions',
        confidence: 0.95,
    },
    end_office_expense: {
        id: 'end_office_expense',
        question: 'Categorized',
        type: 'choice',
        category: 'Office Expenses',
        confidence: 0.95,
    },
    end_asset: {
        id: 'end_asset',
        question: 'Categorized',
        type: 'choice',
        category: 'Assets',
        confidence: 0.8,
        taxNote: 'May need to be depreciated over time.',
    },
    // Placeholder for mixed use logic
    end_ask_percentage: {
        id: 'end_ask_percentage',
        question: 'Categorized',
        type: 'choice',
        category: 'Software & Subscriptions',
        confidence: 0.5,
        taxNote: 'Only the business portion is deductible.',
    },
};

export async function GET() {
    return NextResponse.json(initialTree);
}
