"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/format";

interface YearlyOverviewData {
  year: number;
  production: number;
  sales: number;
}

export function YearlyOverviewChart({ data }: { data: YearlyOverviewData[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatNumber} />
        <Tooltip
          formatter={(value) => formatNumber(Number(value))}
          labelFormatter={(label) => `${label}년`}
        />
        <Legend />
        <Bar dataKey="production" name="생산(A급)" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="sales" name="판매(순출고)" fill="#16a34a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
