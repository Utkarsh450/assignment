import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { MoveLeft } from 'lucide-react';
import { useContext, useState } from "react";
import { ExpenseContextData } from "../Context/ExpenseContextTypes";
import type { BudgetData, ExpenseData } from "../Context/types";
import { nanoid } from "nanoid";

const BudgetExpenses: React.FC = () => {

    const { expenseId } = useParams<string>();
    const [isOpen, setisOpen] = useState(false)
    const { data, setData } = useContext(ExpenseContextData);

    const Budget = data.budgets.find((elem: BudgetData) => elem.id === expenseId);
    const expensesForThisBudget: ExpenseData[] = data.expenses.filter(
        (elem: ExpenseData) => elem.budgetId === expenseId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // console.log(expensesForThisBudget);


    const [amount, setamount] = useState<string>("");
    const [name, setname] = useState<string>("");
    // console.log(Expenses);

    const navigate = useNavigate();

    if (!Budget) return <div className="p-8 text-red-500">Budget Not Found!</div>;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const expenseAmount = Number(amount);
        if (!expenseAmount || expenseAmount <= 0) return;

        const newExpense: ExpenseData = {
            id: nanoid(),
            name: name,
            category: Budget.category,
            budgetId: Budget.id,
            amount: expenseAmount,
            description: name, // Using name as description
            createdAt: new Date(),
            month: new Date().toLocaleString('default', { month: 'long' }).toLowerCase()
        };

        const updatedBudget = {
            ...Budget,
            spent: Budget.spent + expenseAmount,
            ExpenseItems: Budget.ExpenseItems + 1
        };

        setData(prev => ({
            ...prev,
            expenses: [...prev.expenses, newExpense],
            budgets: prev.budgets.map(b => b.id === Budget.id ? updatedBudget : b)
        }));

        setname("");
        setamount("");
    };
    const totalSpent = expensesForThisBudget.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = Budget.amount - totalSpent;
    const isLimitExceeded = totalSpent >= Budget.amount;
    const deleteHandler = (ExpenseId: string) => {
        const expenseToDelete = data.expenses.find((e) => e.id === ExpenseId);
        if (!expenseToDelete) return;

        const updatedExpenses = data.expenses.filter((e) => e.id !== ExpenseId);

        const updatedBudgets = data.budgets.map((b) => {
            if (b.id === expenseToDelete.budgetId) {
                return {
                    ...b,
                    spent: b.spent - expenseToDelete.amount,
                    ExpenseItems: b.ExpenseItems - 1,
                };
            }
            return b;
        });

        setData((prev) => ({
            ...prev,
            expenses: updatedExpenses,
            budgets: updatedBudgets,
        }));
    };
    const deleteBudget = () => {
        if (!expenseId) return;

        const updatedBudgets = data.budgets.filter((b) => b.id !== expenseId);

        const updatedExpenses = data.expenses.filter((e) => e.budgetId !== expenseId);

        setData((prev) => ({
            ...prev,
            budgets: updatedBudgets,
            expenses: updatedExpenses,
        }));
        navigate(-1);



    }


    return (
        <>
            <Layout />

            <div className="w-full h-full">
                <div className="flex items-center justify-between p-8 font-[satoshi]">
                    {isOpen &&
                        <>
                            <div className="w-full h-full fixed inset-0 bg-black/40 backdrop-blur-sm z-20"></div>
                            <div className="w-96 flex flex-col gap-2 fixed top-1/2 left-1/2 bg-zinc-100 z-30 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg p-6">
                                <div className="">
                                    <h1 className="font-bold text-lg">Are you sure?</h1>
                                    <h1 className="font-semibold text-md text-zinc-500">This action cannot be undone. This will permanently delete your current budget along with expeses and remove you data from out servers</h1>
                                </div>
                                <div className="w-full flex gap-4 justify-end items-center">
                                    <div onClick={() => setisOpen(false)} className="w-fit h-fit p-2 rounded text-zinc-50 hover:bg-zinc-500 cursor-pointer bg-zinc-400">cancel</div>
                                    <div onClick={deleteBudget} className="w-fit h-fit p-2 rounded text-zinc-50 hover:bg-sky-600 cursor-pointer bg-sky-500">continue</div>
                                </div>
                            </div></>}
                    <div
                        className="flex gap-4 items-center cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <MoveLeft className="w-5 h-5" />
                        <div className="font-semibold tracking-tighter text-3xl">My Expenses</div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <button onClick={() => setisOpen(!isOpen)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium">
                            Delete
                        </button>
                    </div>
                </div>

                <div className="px-8 flex gap-4 font-[satoshi]">
                    <div className="w-full h-fit max-w-lg p-5 flex flex-col gap-8 rounded-lg bg-white border border-zinc-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-200 p-2 text-2xl">
                                    {Budget.emoji}
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="font-semibold text-lg">{Budget.category}</h1>
                                    <h2 className="text-sm text-zinc-600">{Budget.ExpenseItems} items</h2>
                                </div>
                            </div>

                            <div className="font-semibold text-xl text-green-500">
                                ₹{Budget.amount}
                            </div>
                        </div>

                        <div className="w-full h-2 bg-zinc-300 rounded overflow-hidden">
                            <div
                                className={`h-full rounded ${isLimitExceeded ? "bg-red-500" : "bg-green-500"}`}
                                style={{ width: `${Math.min((totalSpent / Budget.amount) * 100, 100)}%` }}
                            ></div>
                        </div>

                        <div className="w-full flex items-center justify-between">
                            <div className="font-semibold text-sm text-zinc-500">
                                {isLimitExceeded ? "Budget Limit Exceeded" : `${totalSpent} spent`}
                            </div>
                            <div className="font-semibold text-sm text-zinc-500">
                                Remaining: {remaining}
                            </div>
                        </div>
                    </div>

                    <div className="w-200 h-fit rounded p-4 bg-zinc-50 border-zinc-100 border">
                        <div className="font-semibold text-2xl mb-4">Add Expense</div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <h1>Expense Name</h1>
                                <input
                                    value={name}
                                    onChange={(e) => setname(e.target.value)}
                                    type="text"
                                    className="outline-none bg-white border rounded p-2"
                                    placeholder="e.g. Bedroom Decor"
                                />

                                <h1>Expense Amount</h1>
                                <input
                                    value={amount}
                                    onChange={(e) => setamount(e.target.value)}
                                    type="number"
                                    className="outline-none bg-white border rounded p-2"
                                    placeholder="e.g. 1000"
                                />

                                <button
                                    disabled={
                                        !name.trim() ||
                                        !amount.trim() ||
                                        Number(amount) <= 0 ||
                                        Budget.spent >= Budget.amount
                                    }
                                    className={`
    w-fit p-2 mt-2 rounded font-semibold text-white
    ${Budget.spent >= Budget.amount
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-sky-500 hover:bg-sky-600"}
    disabled:bg-zinc-400 disabled:cursor-not-allowed
  `}
                                >
                                    Add Expense
                                </button>

                            </div>
                        </form>
                    </div>
                </div>

                <div className="font-[satoshi] px-8 py-8">
                    <p className="font-semibold text-2xl">Latest Expenses</p>
                    <div className="w-full mt-4 rounded">
                        <div className="w-full h-10 flex items-center justify-around bg-zinc-300">
                            <p className="font-semibold text-md">Name</p>
                            <p className="font-semibold text-md">Amount</p>
                            <p className="font-semibold text-md">Date</p>
                            <p className="font-semibold text-md">Action</p>
                        </div>
                        {expensesForThisBudget.map((elem: ExpenseData) => {
                            return <div className="w-full h-10 flex items-center justify-around bg-zinc-100">
                                <p className="font-semibold text-md">{elem.name}</p>
                                <p className="font-semibold text-md flex">{elem.amount}</p>
                                <p className="font-semibold text-md">{new Date(elem.createdAt).toLocaleDateString()}</p>
                                <p onClick={() => deleteHandler(elem.id)} className="font-semibold text-red-500 text-md flex">Delete</p>
                            </div>
                        })}
                    </div>
                </div>

            </div>
        </>
    );
};


export default BudgetExpenses;