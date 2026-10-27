import { NextResponse } from "next/server";
import {
  getYearlyProduction,
  getYearlySales,
  getProductionByDept,
  getMonthlyTrend,
  getTopProductTypes,
  getTopCustomers,
  getSeasonalIndex,
  getMonthlyHeatmap,
} from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") ?? "2025", 10);

  try {
    const [
      yearlyProduction,
      yearlySales,
      productionByDept,
      monthlyTrend,
      topProducts,
      topCustomers,
      seasonalIndex,
      monthlyHeatmap,
    ] = await Promise.all([
      getYearlyProduction(),
      getYearlySales(),
      getProductionByDept(),
      getMonthlyTrend(year),
      getTopProductTypes(15),
      getTopCustomers(15),
      getSeasonalIndex(),
      getMonthlyHeatmap(),
    ]);

    return NextResponse.json({
      data: {
        yearlyProduction: yearlyProduction.map((r) => ({
          ...r,
          totalA: Number(r.totalA),
          totalC: Number(r.totalC),
        })),
        yearlySales: yearlySales.map((r) => ({
          ...r,
          totalQty: Number(r.totalQty),
          normalQty: Number(r.normalQty),
          returnQty: Number(r.returnQty),
        })),
        productionByDept: productionByDept.map((r) => ({
          ...r,
          totalA: Number(r.totalA),
          totalC: Number(r.totalC),
        })),
        monthlyTrend,
        topProducts: topProducts.map((r) => ({
          ...r,
          totalA: Number(r.totalA),
        })),
        topCustomers: topCustomers.map((r) => ({
          ...r,
          totalQty: Number(r.totalQty),
        })),
        seasonalIndex,
        monthlyHeatmap: monthlyHeatmap.map((r) => ({
          ...r,
          totalQty: Number(r.totalQty),
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "데이터 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
