import { NextRequest, NextResponse } from "next/server";
import {
  runAnalysis,
  PRODUCTION_DIMENSIONS,
  PRODUCTION_MEASURES,
  SALES_DIMENSIONS,
  SALES_MEASURES,
} from "@/lib/analysis-queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dataset, rows, columns, measures, filters } = body;

    if (!dataset || !rows?.length || !measures?.length) {
      return NextResponse.json(
        { error: "dataset, rows, measures는 필수입니다." },
        { status: 400 }
      );
    }

    const result = await runAnalysis({
      dataset,
      rows,
      columns: columns ?? [],
      measures,
      filters,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "분석 중 오류" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    data: {
      production: {
        dimensions: Object.entries(PRODUCTION_DIMENSIONS).map(([k, v]) => ({
          key: k,
          label: v.label,
        })),
        measures: Object.entries(PRODUCTION_MEASURES).map(([k, v]) => ({
          key: k,
          label: v.label,
        })),
      },
      sales: {
        dimensions: Object.entries(SALES_DIMENSIONS).map(([k, v]) => ({
          key: k,
          label: v.label,
        })),
        measures: Object.entries(SALES_MEASURES).map(([k, v]) => ({
          key: k,
          label: v.label,
        })),
      },
    },
  });
}
