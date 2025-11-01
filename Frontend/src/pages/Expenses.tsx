import { useContext, useMemo, useState } from "react"
import { ExpenseContextData } from "../Context/ExpenseContext"

export interface ExpenseData {
    id: string;
    name: string;
    category: string;
    budgetId: string;
    amount: number;
    createdAt: Date;
}

const Expenses = () => {
    const { data, setData } = useContext(ExpenseContextData)
    const [query, setquery] = useState<string>("")
    const [priceRange, setpriceRange] = useState<[number, number]>()
    const [isOpen, setisOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const category = data.budgets.map(elem => elem?.category)
    const budgetAmount = data.expenses.map(elem => elem.amount)
    const maxBudget = budgetAmount.length > 0
        ? Math.max(...budgetAmount)
        : 0;

    console.log(maxBudget);



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
    }
    const filteredExpenses: ExpenseData[] = useMemo(() => {
        return data.expenses.filter((elem) => {
            const matchesSearch =
                elem.name.toLowerCase().includes(query.toLowerCase()) ||
                elem.amount.toString().includes(query);

            const matchesCategory = selectedCategory ? elem.category === selectedCategory : true;

            const matchesPrice = priceRange
                ? elem.amount >= priceRange[0] && priceRange[1] && (elem.amount <= priceRange[1])
                : true;

            return matchesSearch && matchesCategory && matchesPrice;
        });
    }, [query, selectedCategory, priceRange, data.expenses]);
    return (
        <div className='w-full h-full p-4'>
            <div className="font-[satoshi] px-8 py-8">
                <p className="font-semibold text-2xl mb-3">Latest Expenses</p>
                <div className="w-full flex rounded-xl gap-4">
                    <div onClick={() => setisOpen(!isOpen)} className="w-38 transition-all cursor-pointer hover:bg-zinc-400 h-10 rounded-full bg-zinc-300 border-zinc-400 border-2 text-center py-1 font-semibold">Filter</div>
                    {isOpen && (
                        <div className="w-80 p-4 h-fit rounded absolute top-28 bg-zinc-700 z-20 flex flex-col gap-4">

                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "₹10 - ₹50", range: [10, 50] },
                                    { label: "₹60 - ₹140", range: [60, 140] },
                                    { label: "₹150 - ₹200", range: [150, 200] },
                                    { label: "300 and more", range: [300, Math.max(...budgetAmount)] }
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


                    <input value={query} onChange={(e) => setquery(e.target.value)} className="w-full outline-none bg-zinc-300 rounded-xl h-10 font-semibold text-zinc-600 p-4" type="text" placeholder="Search your Expenses..." />
                </div>
                <div className="w-full mt-4 rounded">
                    <div className="w-full h-10 flex items-center justify-around bg-zinc-300">
                        <p className="font-semibold text-md">Name</p>
                        <p className="font-semibold text-md">Amount</p>
                        <p className="font-semibold text-md">Category</p>
                        <p className="font-semibold text-md">Date</p>
                        <p className="font-semibold text-md">Action</p>
                    </div>
                    {filteredExpenses.map((elem: ExpenseData) => {
                        return <div key={elem.id} className="w-full bg-zinc-100 h-10 flex items-center justify-around">
                            <div className="font-semibold text-md">{elem.name}</div>
                            <div className="font-semibold flex items-center text-md">{elem.amount}</div>
                            <div className="font-semibold text-md">{elem.category}</div>
                            <div className="font-semibold text-md">{new Date(elem.createdAt).toLocaleDateString()}</div>
                            <div onClick={() => deleteHandler(elem.id)} className="font-semibold cursor-pointer text-red-500 text-md">Delete</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Expenses