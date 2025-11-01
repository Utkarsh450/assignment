import { useState, type ReactNode, useEffect } from "react";
import type { BudgetData, ExpenseData } from "./types";
import { ExpenseContextData } from "./ExpenseContextTypes";

const ExpenseContext = ({ children }: { children: ReactNode }) => {

    const [data, setData] = useState<{ budgets: BudgetData[]; expenses: ExpenseData[] }>({
        budgets: [],
        expenses: [],
    });

    useEffect(() => {
        const stored = localStorage.getItem("BudgetData");

        if (stored) {
            const storedItem = JSON.parse(stored);

            storedItem.budgets = storedItem.budgets.map((b: Omit<BudgetData, 'createdAt'> & { createdAt: string }) => ({
                ...b,
                createdAt: new Date(b.createdAt),
            }));

            storedItem.expenses = storedItem.expenses.map((e: Omit<ExpenseData, 'createdAt'> & { createdAt: string }) => ({
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
