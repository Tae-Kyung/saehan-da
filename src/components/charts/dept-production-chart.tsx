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

interface DeptData {
  year: number;
  departmentCode: string;
  departmentName: string;
  totalA: number;
}

export function DeptProductionChart({ data }: { data: DeptData[] }) {
  // 연도별로 피벗
  const years = [...new Set(data.map((d) => d.year))].sort();
  const pivoted = years.map((year) => {
    const row: Record<string, number | string> = { year };
    for (const d of data.filter((r) => r.year === year)) {
      row[d.departmentCode] = d.totalA;
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={pivoted} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatNumber} />
        <Tooltip
          formatter={(value) => formatNumber(Number(value))}
          labelFormatter={(label) => `${label}년`}
        />
        <Legend />
        <Bar dataKey="1211" name="PET 1팀" fill="#2563eb" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="1212" name="PE 팀" fill="#dc2626" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="1219" name="PET 2팀" fill="#9333ea" stackId="a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
