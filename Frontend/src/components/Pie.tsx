import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";

interface BudgetData {
  id: string;
  category: string;
  amount: number;
  month: string;
  spent: number;
  ExpenseItems: number;
  emoji: string;
  createdAt: Date;
}

interface PieProps {
  filteredBudgets: BudgetData[];
}

const Pie: React.FC<PieProps> = ({ filteredBudgets }) => {

  const data = filteredBudgets.map((item) => ({
    label: item.category,
    value: item.amount,
    color: item.emoji ? undefined : undefined,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <div className="relative flex items-center justify-center">

        <PieChart
          width={215}
          height={215}
          series={[
            {
              paddingAngle: 5,
              innerRadius: "75%",
              outerRadius: "100%",
              cornerRadius: 12,
              data,
            },
          ]}
          hideLegend
        />

        <div className="absolute text-center">
          <p className="text-xs text-gray-500">Total Budget</p>
          <p className="text-xl font-semibold">₹{total}</p>
        </div>

      </div>
    </Stack>
  );
};

export default Pie;
