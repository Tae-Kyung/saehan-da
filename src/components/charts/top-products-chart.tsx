"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/lib/format";

interface ProductData {
  productType: string | null;
  productName: string | null;
  totalA: number;
}

export function TopProductsChart({ data }: { data: ProductData[] }) {
  const chartData = data.map((d) => {
    const name = d.productName?.trim() || d.productType || "기타";
    return {
      name: name.length > 20 ? name.slice(0, 20) + "..." : name,
      fullName: name,
      totalA: d.totalA,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={formatNumber} />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => formatNumber(Number(value))}
          labelFormatter={(_, payload) =>
            payload?.[0]?.payload?.fullName ?? ""
          }
        />
        <Bar dataKey="totalA" name="생산량(A급)" fill="#4f46e5" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
