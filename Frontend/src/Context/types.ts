export interface BudgetData {
    id: string;
    category: string;
    amount: number;
    spent: number;
    ExpenseItems: number;
    emoji: string;
    createdAt: Date;
}

export interface ExpenseData {
    id: string;
    name: string;
    category: string;
    budgetId: string;
    amount: number;
    description: string;
    createdAt: Date;
    month?: string;
}