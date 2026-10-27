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

interface LagData {
  lag: number;
  correlation: number;
  pairs: number;
}

export function LagCorrelationChart({ data }: { data: LagData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="lag"
          tickFormatter={(v) => `${v}개월`}
        />
        <YAxis domain={[-1, 1]} tickFormatter={(v) => v.toFixed(1)} />
        <Tooltip
          formatter={(value) => Number(value).toFixed(4)}
          labelFormatter={(label) => `리드타임: ${label}개월`}
        />
        <ReferenceLine y={0} stroke="#888" />
        <Bar dataKey="correlation" name="상관계수" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.correlation >= 0.7 ? "#16a34a" : entry.correlation >= 0.4 ? "#2563eb" : "#94a3b8"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
