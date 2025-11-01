import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";

import type { ExpenseData } from "../Context/types";

interface PieProps {
  filteredExpenses: ExpenseData[];
}

const Pie: React.FC<PieProps> = ({ filteredExpenses }) => {
  const COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFD93D", // Yellow
  "#6A5ACD", // Purple
  "#FFA500", // Orange
  "#1E90FF", // Blue
  "#2ECC71", // Green
  "#FF7F50", // Coral
];

  const data = filteredExpenses.map((item, index) => ({
    label: item.name,
    value: item.amount,
    color:  COLORS[index % COLORS.length] ? undefined : undefined,
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
