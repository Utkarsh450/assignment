import { useContext, useState } from "react";
import { ExpenseContextData } from "../Context/ExpenseContextTypes";
import type { BudgetData, ExpenseData } from "../Context/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import Pie from "../components/Pie";

const Dashboard: React.FC = () => {
  const { data } = useContext(ExpenseContextData);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  // ✅ Filter Based on Month Field (NOT createdAt date anymore)
  const filterByMonth = (items: ExpenseData[] | BudgetData[]) => {
    if (selectedMonth === "all") return items;
    return items.filter((elem) => elem.month?.toLowerCase() === selectedMonth.toLowerCase());
  };

  const filteredBudgets = filterByMonth(data.budgets) as BudgetData[];
  const filteredExpenses = filterByMonth(data.expenses) as ExpenseData[];

  const TotalBudget = filteredBudgets.reduce((acc, b) => acc + b.amount, 0);
  const TotalExpense = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);

  // ✅ Extract unique month labels directly from budget array
  const labels = [...new Set(data.budgets.map(b => b.month))];

  // ✅ Prepare Bar Chart Data Using Month Field
  const chartData = labels.map(month => {
    const totalBudget = filteredBudgets
      .filter(b => b.month === month)
      .reduce((sum, b) => sum + b.amount, 0);

    const totalExpense = filteredExpenses
      .filter(e => e.month === month)
      .reduce((sum, e) => sum + e.amount, 0);

    return { month, budget: totalBudget, expense: totalExpense };
  });

  const sortedData = filteredExpenses
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const growthRate = TotalBudget > 0
    ? ((TotalBudget - TotalExpense) / TotalBudget) * 100
    : 0;


  return (
    <div className="w-full min-h-screen bg-white font-[satoshi] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, User!</h1>
          <p className="text-sm text-gray-500">It is the best time to manage your finances</p>
        </div>

        {/* ✅ Month Selector Working Correctly Now */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-lg outline-none text-sm"
        >
          <option value="all">All Time</option>
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[{
          title: "Total Budget",
          amount: `₹${TotalBudget}.00`,
          change: "+12.1% vs last month",
          positive: true
        }, {
          title: "Expense",
          amount: `₹${TotalExpense}.00`,
          change: "-2.4% vs last month",
          positive: false
        }, {
          title: "Total savings",
          amount: `₹${TotalBudget - TotalExpense}.00`,
          change: "+12.1% vs last month",
          positive: true
        }, {
          title: "Growth rate",
          amount: `${growthRate.toFixed(2)}%`,
          change: "+2% vs last month",
          positive: true
        }].map((item, i) => (
          <div key={i} className="p-4 border rounded-2xl flex flex-col gap-1">
            <h3 className="text-sm text-gray-500">{item.title}</h3>
            <h2 className="text-2xl font-semibold">{item.amount}</h2>
            <p className={`text-xs ${item.positive ? "text-green-500" : "text-red-500"}`}>{item.change}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart + Pie */}
      <div className="flex gap-4">
        <div className="w-[60%] border rounded-2xl p-4 h-fit flex items-center justify-center text-gray-400 text-sm">
          <h3 className="font-semibold mb-4">Expense vs Budget</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#4682B4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#E0B0FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-[40%] border rounded-2xl p-4 flex justify-between">
          <div className="flex gap-16 p-4">
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">Budget</h3>
              <div className="text-sm flex flex-col gap-1">
                {filteredBudgets
                  .slice(0, 6)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((elem) => (
                    <div key={elem.id} className="flex gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                      <div className="font-semibold text-zinc-500">{elem.category}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex items-center justify-center w-48 h-48 text-gray-400">
              <Pie filteredBudgets={filteredBudgets} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="w-full border rounded-2xl p-4">
        <h3 className="font-semibold mb-4">Recent transactions</h3>
        <div className="text-sm">
          <div className="w-full h-10 flex items-center text-purple-500 justify-around bg-purple-100 rounded-full">
            <p className="font-semibold text-md">Name</p>
            <p className="font-semibold text-md">Amount</p>
            <p className="font-semibold text-md">Category</p>
            <p className="font-semibold text-md">Date</p>
          </div>
          {sortedData.map((elem: ExpenseData) => (
            <div key={elem.id} className="w-full h-10 flex items-center rounded justify-around bg-white">
              <p className="font-semibold text-md">{elem.name}</p>
              <p className="font-semibold text-md">{elem.amount}</p>
              <p className="font-semibold text-md">{elem.category}</p>
              <p className="font-semibold text-md">{new Date(elem.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
