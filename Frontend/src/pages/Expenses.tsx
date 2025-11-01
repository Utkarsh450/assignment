import { useContext, useMemo, useState } from "react";
import { ExpenseContextData } from "../Context/ExpenseContextTypes";
import type { ExpenseData, BudgetData } from "../Context/types";

const Expenses = () => {
    const { data, setData } = useContext(ExpenseContextData);
    const [query, setquery] = useState<string>("");
    const [priceRange, setpriceRange] = useState<[number, number] | null>(null);
    const [isOpen, setisOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState("All");

    const category = [...new Set(data.budgets.map((elem: BudgetData) => elem.category))];
    const budgetAmount = data.expenses.map((elem: ExpenseData) => elem.amount);
    const maxBudget = budgetAmount.length > 0 ? Math.max(...budgetAmount) : 0;

    const deleteHandler = (ExpenseId: string) => {
        const expenseToDelete = data.expenses.find((e: ExpenseData) => e.id === ExpenseId);
        if (!expenseToDelete) return;

        const updatedExpenses = data.expenses.filter((e: ExpenseData) => e.id !== ExpenseId);

        const updatedBudgets = data.budgets.map((b: BudgetData) => {
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

    const filterByMonth = useMemo(() => {
        return (items: ExpenseData[]) => {
            if (selectedMonth === "All") return items;
            return items.filter((elem) => elem.month === selectedMonth);
        };
    }, [selectedMonth]);

    const filteredExpenses: ExpenseData[] = useMemo(() => {
        const monthFiltered = filterByMonth(data.expenses);

        return monthFiltered.filter((elem) => {
            const matchesSearch =
                elem.name.toLowerCase().includes(query.toLowerCase()) ||
                elem.amount.toString().includes(query);

            const matchesCategory = selectedCategory ? elem.category === selectedCategory : true;

            const matchesPrice =
                priceRange ? elem.amount >= priceRange[0] && elem.amount <= priceRange[1] : true;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [query, selectedCategory, priceRange, data.expenses, filterByMonth]);

    return (
        <div className="w-full h-full p-4">
            <div className="font-[satoshi] px-8 py-8">
                <p className="font-semibold text-2xl mb-3">Latest Expenses</p>

                <div className="w-full flex gap-4 items-center">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="outline-none bg-zinc-300 rounded-xl h-10 px-4 font-semibold cursor-pointer"
                    >
                        <option value="All">All</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>

                    <div
                        onClick={() => setisOpen(!isOpen)}
                        className="cursor-pointer hover:bg-zinc-400 h-10 rounded-full bg-zinc-300 border-zinc-400 border-2 text-center px-4 font-semibold flex items-center"
                    >
                        Filter
                    </div>

                    {isOpen && (
                        <div className="w-80 p-4 h-fit rounded absolute top-28 bg-zinc-700 z-20 flex flex-col gap-4">

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "₹10 - ₹50", range: [10, 50] },
                                    { label: "₹60 - ₹140", range: [60, 140] },
                                    { label: "₹150 - ₹200", range: [150, 200] },
                                    { label: "₹300 and more", range: [300, maxBudget] },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        onClick={() => setpriceRange(item.range as [number, number])}
                                        className={`cursor-pointer px-2 py-1 text-sm rounded-full font-semibold border transition-all ${priceRange?.[0] === item.range[0] && priceRange?.[1] === item.range[1]
                                                ? "bg-blue-500 border-blue-400 text-white"
                                                : "bg-zinc-600 border-zinc-500 text-zinc-100"
                                            }`}
                                    >
                                        {item.label}
                                    </div>
                                ))}

                                <div
                                    onClick={() => setpriceRange(null)}
                                    className="cursor-pointer px-2 py-1 rounded-full text-sm font-semibold bg-red-500 text-white"
                                >
                                    Clear Range
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {category.map((cat) => (
                                    <div
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`cursor-pointer px-2 py-1 text-sm rounded-full font-semibold border transition-all ${selectedCategory === cat
                                                ? "bg-green-500 border-green-400 text-white"
                                                : "bg-zinc-600 border-zinc-500 text-zinc-100"
                                            }`}
                                    >
                                        {cat}
                                    </div>
                                ))}

                                {selectedCategory && (
                                    <div
                                        onClick={() => setSelectedCategory(null)}
                                        className="cursor-pointer px-2 py-1 rounded-full text-sm font-semibold bg-red-500 text-white"
                                    >
                                        Clear Category
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <input
                        value={query}
                        onChange={(e) => setquery(e.target.value)}
                        className="w-full outline-none bg-zinc-300 rounded-xl h-10 font-semibold text-zinc-600 p-4"
                        type="text"
                        placeholder="Search your Expenses..."
                    />
                </div>

                <div className="w-full mt-4 rounded">
                    <div className="w-full h-10 flex items-center justify-around bg-zinc-300">
                        <p className="font-semibold text-md">Name</p>
                        <p className="font-semibold text-md">Amount</p>
                        <p className="font-semibold text-md">Category</p>
                        <p className="font-semibold text-md">Month</p>
                        <p className="font-semibold text-md">Action</p>
                    </div>

                    {filteredExpenses.map((elem: ExpenseData) => (
                        <div key={elem.id} className="w-full bg-zinc-100 h-10 flex items-center justify-around">
                            <div className="font-semibold text-md">{elem.name}</div>
                            <div className="font-semibold flex items-center text-md">₹{elem.amount}</div>
                            <div className="font-semibold text-md">{elem.category}</div>
                            <div className="font-semibold text-md">{elem.month}</div>
                            <div
                                onClick={() => deleteHandler(elem.id)}
                                className="font-semibold cursor-pointer text-red-500 text-md"
                            >
                                Delete
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
