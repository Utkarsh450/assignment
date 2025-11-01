import { useContext, useState } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { ExpenseContextData } from "../Context/ExpenseContext";
import { nanoid } from "nanoid";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const Budgets: React.FC = () => {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [selectedMonth, setselectedMonth] = useState("All")
  const [name, setname] = useState<string>("");
  const [amount, setamount] = useState<string>("");
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🙂");
  const [month, setmonth] = useState<string>("")
  const [monthInput, setMonthInput] = useState<string>("");

  const { data, setData } = useContext(ExpenseContextData)!;

  const addEmoji = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
    setShowPicker(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newBudget = {
      id: nanoid(),
      category: name,
      month: month,
      amount: Number(amount),
      spent: 0,
      emoji: selectedEmoji,
      ExpenseItems: 0,
      createdAt: new Date(),
    };

    setData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, newBudget],
    }));

    setname("");
    setamount("");
    setSelectedEmoji("🙂");
    setmonth("")
    setisOpen(false);
  };

  return (
    <>
      <Layout />
      <div className="w-full h-full relative font-[satoshi]">

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"></div>

            <div className="fixed top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-6 w-11/12 sm:w-96 max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-semibold text-xl">Create Budget</h1>
                <button onClick={() => setisOpen(false)} className="text-2xl">×</button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2 relative">

                <div
                  className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center cursor-pointer text-2xl"
                  onClick={() => setShowPicker(!showPicker)}
                >
                  {selectedEmoji}
                </div>

                {showPicker && (
                  <div className="absolute top-16 z-50">
                    <EmojiPicker onEmojiClick={addEmoji} />
                  </div>
                )}
                <p className="font-semibold text-md">Budget Name</p>
                <input
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  className="p-2 border rounded w-full outline-none"
                  type="text"
                  placeholder="e.g. Shopping"
                  required
                />
                <p className="font-semibold text-md">Budget Amount</p>

                <input
                  value={amount}
                  onChange={(e) => setamount(e.target.value)}
                  className="p-2 border rounded w-full outline-none"
                  type="number"
                  placeholder="e.g. 5000"
                  required
                />
                <p className="font-semibold text-md">Budget Month</p>
<input
  value={monthInput}
  onChange={(e) => {
    const value = e.target.value;
    setMonthInput(value);

    const date = new Date(value);
    const monthName = date.toLocaleString("default", { month: "long" });
    setmonth(monthName);
  }}
  className="p-2 border rounded w-full outline-none"
  type="month"
  required
/>

                <button type="submit" className="p-2 bg-sky-500 hover:bg-sky-600 transition text-white rounded">
                  Create Budget
                </button>
              </form>
            </div>
          </>
        )}

        <div className="px-6 sm:px-10 py-6">
          <h1 className="font-semibold text-3xl">My Budgets</h1>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div
              onClick={() => setisOpen(true)}
              className="border-2 border-dashed border-zinc-400 hover:border-zinc-600 transition-all flex flex-col justify-center items-center rounded-xl py-10 cursor-pointer"
            >
              <h1 className="text-4xl font-semibold">+</h1>
              <p className="font-medium text-lg mt-1">Create New Budget</p>
            </div>

            {data.budgets.map((item) => (
              <Link
                to={`/budgets/${item.id}`}
                key={item.id}
                className="bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 text-2xl">
                    {item.emoji}
                  </div>
                  <div>
                    <h1 className="font-semibold">{item.category}</h1>
                    <p className="text-zinc-500">{item.ExpenseItems} item</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${(item.spent * 100) / item.amount}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-zinc-400">₹ {item.spent} spent</span>
                  <span className="text-xl font-semibold text-green-600">₹ {item.amount}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Budgets;
