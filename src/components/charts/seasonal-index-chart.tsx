"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { MONTH_LABELS } from "@/lib/format";

interface SeasonalData {
  month: number;
  index: number;
}

export function SeasonalIndexChart({ data }: { data: SeasonalData[] }) {
  const chartData = data.map((d) => ({
    ...d,
    name: MONTH_LABELS[d.month - 1],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, "auto"]} tickFormatter={(v) => v.toFixed(1)} />
        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
        <ReferenceLine y={1} stroke="#888" strokeDasharray="3 3" label="평균(1.0)" />
        <Bar dataKey="index" name="계절지수" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.index >= 1 ? "#16a34a" : "#dc2626"}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
