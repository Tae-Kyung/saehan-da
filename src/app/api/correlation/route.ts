import { NextRequest, NextResponse } from "next/server";
import {
  getCommonProductTypes,
  getProductTimeSeries,
  getScatterData,
  getProductScatterData,
  getLagCorrelation,
} from "@/lib/correlation-queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const productType = searchParams.get("productType");

  try {
    switch (type) {
      case "common-products":
        return NextResponse.json({ data: await getCommonProductTypes() });

      case "product-timeseries":
        if (!productType) {
          return NextResponse.json({ error: "productType 필수" }, { status: 400 });
        }
        return NextResponse.json({ data: await getProductTimeSeries(productType) });

      case "scatter-monthly":
        return NextResponse.json({ data: await getScatterData() });

      case "scatter-products":
        return NextResponse.json({ data: await getProductScatterData() });

      case "lag-correlation":
        return NextResponse.json({ data: await getLagCorrelation() });

      default:
        // 전체 요약 데이터 반환
        const [commonProducts, scatterMonthly, productScatter, lagCorr] =
          await Promise.all([
            getCommonProductTypes(),
            getScatterData(),
            getProductScatterData(),
            getLagCorrelation(),
          ]);
        return NextResponse.json({
          data: {
            commonProducts,
            scatterMonthly,
            productScatter,
            lagCorrelation: lagCorr,
          },
        });
    }
  } catch (error) {
    console.error("Correlation API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "분석 오류" },
      { status: 500 }
    );
  }
}
