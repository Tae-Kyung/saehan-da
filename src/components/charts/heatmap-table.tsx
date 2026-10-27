"use client";

import { formatNumber, MONTH_LABELS } from "@/lib/format";

interface HeatmapData {
  year: number;
  month: number;
  totalQty: number;
}

export function HeatmapTable({ data }: { data: HeatmapData[] }) {
  const years = [...new Set(data.map((d) => d.year))].sort();
  const allValues = data.map((d) => d.totalQty);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  function getColor(value: number): string {
    const ratio = (value - minVal) / (maxVal - minVal || 1);
    // green scale
    const g = Math.round(100 + ratio * 155);
    const r = Math.round(240 - ratio * 180);
    const b = Math.round(240 - ratio * 180);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function getValue(year: number, month: number): number {
    return data.find((d) => d.year === year && d.month === month)?.totalQty ?? 0;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left border font-medium">연도</th>
            {MONTH_LABELS.map((m) => (
              <th key={m} className="p-2 text-center border font-medium">{m}</th>
            ))}
            <th className="p-2 text-center border font-medium">합계</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => {
            const yearTotal = Array.from({ length: 12 }, (_, i) =>
              getValue(year, i + 1)
            ).reduce((a, b) => a + b, 0);
            return (
              <tr key={year}>
                <td className="p-2 border font-medium">{year}</td>
                {Array.from({ length: 12 }, (_, i) => {
                  const val = getValue(year, i + 1);
                  return (
                    <td
                      key={i}
                      className="p-2 text-center border text-xs"
                      style={{ backgroundColor: val > 0 ? getColor(val) : "transparent" }}
                      title={val.toLocaleString()}
                    >
                      {formatNumber(val)}
                    </td>
                  );
                })}
                <td className="p-2 text-center border font-medium text-xs">
                  {formatNumber(yearTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
