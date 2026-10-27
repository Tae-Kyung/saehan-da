"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber, MONTH_LABELS } from "@/lib/format";

interface MonthlyData {
  month: number;
  production: number;
  sales: number;
}

export function MonthlyTrendChart({ data }: { data: MonthlyData[] }) {
  const chartData = data.map((d) => ({
    ...d,
    name: MONTH_LABELS[d.month - 1],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatNumber} />
        <Tooltip formatter={(value) => formatNumber(Number(value))} />
        <Legend />
        <Line
          type="monotone"
          dataKey="production"
          name="생산(A급)"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="sales"
          name="판매(순출고)"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
