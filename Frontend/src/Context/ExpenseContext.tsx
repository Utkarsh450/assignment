import { createContext, useState, ReactNode, useEffect } from "react";

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
    category: string;
    budgetId: string;
    amount: number;
    createdAt: Date;
}

interface ExpenseContextType {
    data: {
        budgets: BudgetData[];
        expenses: ExpenseData[];
    };
    setData: React.Dispatch<
        React.SetStateAction<{
            budgets: BudgetData[];
            expenses: ExpenseData[];
        }>
    >;
}

export const ExpenseContextData = createContext<ExpenseContextType | null>(null);

const ExpenseContext = ({ children }: { children: ReactNode }) => {

    const [data, setData] = useState<{ budgets: BudgetData[]; expenses: ExpenseData[] }>({
        budgets: [],
        expenses: [],
    });

    useEffect(() => {
        const stored = localStorage.getItem("BudgetData");

        if (stored) {
            const storedItem = JSON.parse(stored);

            storedItem.budgets = storedItem.budgets.map((b: any) => ({
                ...b,
                createdAt: new Date(b.createdAt),
            }));

            storedItem.expenses = storedItem.expenses.map((e: any) => ({
                ...e,
                createdAt: new Date(e.createdAt),
            }));

            setData(storedItem);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("BudgetData", JSON.stringify(data));
    }, [data]);

    return (
        <ExpenseContextData.Provider value={{ data, setData }}>
            {children}
        </ExpenseContextData.Provider>
    );
};

export default ExpenseContext;
