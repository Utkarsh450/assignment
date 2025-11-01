import { createContext } from "react";
import type { BudgetData, ExpenseData } from "./types";

// Context type
export interface ExpenseContextType {
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

export const ExpenseContextData = createContext<ExpenseContextType>({
    data: { budgets: [], expenses: [] },
    setData: () => {}
});