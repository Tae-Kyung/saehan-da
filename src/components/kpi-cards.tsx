"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";

interface KpiData {
  yearlyProduction: { year: number; totalA: number; totalC: number }[];
  yearlySales: { year: number; totalQty: number; normalQty: number; returnQty: number }[];
}

export function KpiCards({ data }: { data: KpiData }) {
  const latestYear = 2025;
  const prevYear = 2024;

  const latest = data.yearlySales.find((r) => r.year === latestYear);
  const prev = data.yearlySales.find((r) => r.year === prevYear);
  const latestProd = data.yearlyProduction.find((r) => r.year === latestYear);
  const prevProd = data.yearlyProduction.find((r) => r.year === prevYear);

  const salesGrowth = prev && latest
    ? ((latest.totalQty - prev.totalQty) / Math.abs(prev.totalQty) * 100).toFixed(1)
    : "N/A";
  const prodGrowth = prevProd && latestProd
    ? ((latestProd.totalA - prevProd.totalA) / Math.abs(prevProd.totalA) * 100).toFixed(1)
    : "N/A";

  const totalProd5yr = data.yearlyProduction.reduce((s, r) => s + r.totalA, 0);
  const totalSales5yr = data.yearlySales.reduce((s, r) => s + r.totalQty, 0);
  const totalReturn5yr = data.yearlySales.reduce((s, r) => s + r.returnQty, 0);
  const defectRate = latestProd
    ? ((latestProd.totalC / (latestProd.totalA + latestProd.totalC)) * 100).toFixed(2)
    : "N/A";

  const cards = [
    {
      title: "2025 판매량",
      value: formatNumber(latest?.totalQty ?? 0),
      sub: `전년 대비 ${salesGrowth}%`,
      positive: Number(salesGrowth) > 0,
    },
    {
      title: "2025 생산량(A급)",
      value: formatNumber(latestProd?.totalA ?? 0),
      sub: `전년 대비 ${prodGrowth}%`,
      positive: Number(prodGrowth) > 0,
    },
    {
      title: "5년 누적 판매",
      value: formatNumber(totalSales5yr),
      sub: `반품 ${formatNumber(Math.abs(totalReturn5yr))}`,
      positive: true,
    },
    {
      title: "2025 불량율",
      value: `${defectRate}%`,
      sub: `5년 생산 ${formatNumber(totalProd5yr)}`,
      positive: Number(defectRate) < 2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className={`text-xs mt-1 ${card.positive ? "text-green-600" : "text-red-600"}`}>
              {card.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
