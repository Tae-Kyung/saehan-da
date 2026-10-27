"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCards } from "@/components/kpi-cards";
import { YearlyOverviewChart } from "@/components/charts/yearly-overview-chart";
import { DeptProductionChart } from "@/components/charts/dept-production-chart";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { SeasonalIndexChart } from "@/components/charts/seasonal-index-chart";
import { TopProductsChart } from "@/components/charts/top-products-chart";
import { TopCustomersChart } from "@/components/charts/top-customers-chart";
import { HeatmapTable } from "@/components/charts/heatmap-table";

interface DashboardData {
  yearlyProduction: { year: number; totalA: number; totalC: number; rowCount: number }[];
  yearlySales: { year: number; totalQty: number; normalQty: number; returnQty: number; rowCount: number }[];
  productionByDept: { year: number; departmentCode: string; departmentName: string; totalA: number; totalC: number }[];
  monthlyTrend: { month: number; production: number; sales: number }[];
  topProducts: { productType: string | null; productName: string | null; totalA: number }[];
  topCustomers: { customerName: string | null; totalQty: number; orderCount: number }[];
  seasonalIndex: { month: number; index: number }[];
  monthlyHeatmap: { year: number; month: number; totalQty: number }[];
}

const YEARS = [2021, 2022, 2023, 2024, 2025];

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?year=${selectedYear}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedYear]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">데이터 로딩 중...</div>
      </div>
    );
  }

  // 연도별 생산·판매 통합 데이터
  const yearlyOverview = data.yearlyProduction.map((p) => {
    const s = data.yearlySales.find((r) => r.year === p.year);
    return {
      year: p.year,
      production: p.totalA,
      sales: s?.totalQty ?? 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* KPI 카드 */}
      <KpiCards data={data} />

      {/* 메인 탭 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">종합 현황</TabsTrigger>
          <TabsTrigger value="monthly">월별 분석</TabsTrigger>
          <TabsTrigger value="products">품종/거래선</TabsTrigger>
        </TabsList>

        {/* 종합 현황 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>연도별 생산·판매 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <YearlyOverviewChart data={yearlyOverview} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>부서별 생산량(A급) 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <DeptProductionChart data={data.productionByDept} />
              </CardContent>
            </Card>
          </div>

          {/* 판매 히트맵 */}
          <Card>
            <CardHeader>
              <CardTitle>연도별·월별 판매량 히트맵</CardTitle>
            </CardHeader>
            <CardContent>
              <HeatmapTable data={data.monthlyHeatmap} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 월별 분석 탭 */}
        <TabsContent value="monthly" className="space-y-4">
          {/* 연도 선택 */}
          <div className="flex gap-2">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedYear === y
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {y}년
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{selectedYear}년 월별 생산·판매 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyTrendChart data={data.monthlyTrend} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>월별 계절 지수 (5년 평균)</CardTitle>
              </CardHeader>
              <CardContent>
                <SeasonalIndexChart data={data.seasonalIndex} />
              </CardContent>
            </Card>
          </div>

          {/* 월별 상세 테이블 */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedYear}년 월별 상세</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left font-medium">월</th>
                      <th className="p-2 text-right font-medium">생산(A급)</th>
                      <th className="p-2 text-right font-medium">판매(순출고)</th>
                      <th className="p-2 text-right font-medium">차이</th>
                      <th className="p-2 text-right font-medium">계절지수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.monthlyTrend.map((row) => {
                      const diff = row.sales - row.production;
                      const si = data.seasonalIndex.find((s) => s.month === row.month);
                      return (
                        <tr key={row.month} className="border-b hover:bg-muted/50">
                          <td className="p-2">{row.month}월</td>
                          <td className="p-2 text-right">{row.production.toLocaleString()}</td>
                          <td className="p-2 text-right">{row.sales.toLocaleString()}</td>
                          <td className={`p-2 text-right ${diff >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {diff >= 0 ? "+" : ""}{diff.toLocaleString()}
                          </td>
                          <td className="p-2 text-right">{si?.index.toFixed(2) ?? "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 품종/거래선 탭 */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>품종별 TOP 15 생산량</CardTitle>
              </CardHeader>
              <CardContent>
                <TopProductsChart data={data.topProducts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>거래선별 TOP 15 판매량</CardTitle>
              </CardHeader>
              <CardContent>
                <TopCustomersChart data={data.topCustomers} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
