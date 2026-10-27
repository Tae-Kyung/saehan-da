import { NextRequest, NextResponse } from "next/server";
import { getDimensionValues } from "@/lib/analysis-queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dataset = searchParams.get("dataset") as "production" | "sales";
  const dimension = searchParams.get("dimension");

  if (!dataset || !dimension) {
    return NextResponse.json(
      { error: "dataset, dimension은 필수입니다." },
      { status: 400 }
    );
  }

  try {
    const values = await getDimensionValues(dataset, dimension);
    return NextResponse.json({ data: values });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "조회 오류" },
      { status: 500 }
    );
  }
}
