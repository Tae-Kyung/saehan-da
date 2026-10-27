"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DimensionSelector } from "./dimension-selector";
import { FilterPanel } from "./filter-panel";
import { ResultTable } from "./result-table";
import { ResultChart } from "./result-chart";

interface DimOption {
  key: string;
  label: string;
}

interface SchemaData {
  production: { dimensions: DimOption[]; measures: DimOption[] };
  sales: { dimensions: DimOption[]; measures: DimOption[] };
}

interface AnalysisResult {
  rows: Record<string, unknown>[];
  totalRows: number;
}

export function AnalysisPageClient() {
  const [schema, setSchema] = useState<SchemaData | null>(null);
  const [dataset, setDataset] = useState<"production" | "sales">("production");
  const [rowDims, setRowDims] = useState<string[]>(["year"]);
  const [colDim, setColDim] = useState<string[]>([]);
  const [measures, setMeasures] = useState<string[]>(["qty_grade_a"]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  useEffect(() => {
    fetch("/api/analysis")
      .then((r) => r.json())
      .then((json) => setSchema(json.data));
  }, []);

  // 데이터셋 변경 시 초기화
  function handleDatasetChange(ds: "production" | "sales") {
    setDataset(ds);
    setRowDims(["year"]);
    setColDim([]);
    setMeasures(ds === "production" ? ["qty_grade_a"] : ["shipment_qty"]);
    setFilters({});
    setResult(null);
  }

  const runQuery = useCallback(async () => {
    if (rowDims.length === 0 || measures.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset,
          rows: rowDims,
          columns: colDim,
          measures,
          filters,
        }),
      });
      const json = await res.json();
      if (json.data) setResult(json.data);
    } finally {
      setLoading(false);
    }
  }, [dataset, rowDims, colDim, measures, filters]);

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">스키마 로딩 중...</div>
      </div>
    );
  }

  const currentSchema = schema[dataset];
  const dimLabels = Object.fromEntries(currentSchema.dimensions.map((d) => [d.key, d.label]));
  const measureLabels = Object.fromEntries(currentSchema.measures.map((m) => [m.key, m.label]));
  const allSelectedDims = [...rowDims, ...colDim];

  return (
    <div className="space-y-4">
      {/* 데이터셋 선택 */}
      <div className="flex gap-2">
        <button
          onClick={() => handleDatasetChange("production")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            dataset === "production"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          생산실적
        </button>
        <button
          onClick={() => handleDatasetChange("sales")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            dataset === "sales"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          판매실적
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 좌측: 설정 패널 */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">행 차원 (최대 3개)</CardTitle>
            </CardHeader>
            <CardContent>
              <DimensionSelector
                title=""
                available={currentSchema.dimensions}
                selected={rowDims}
                onChange={setRowDims}
                max={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">열 피벗 (최대 1개)</CardTitle>
            </CardHeader>
            <CardContent>
              <DimensionSelector
                title=""
                available={currentSchema.dimensions.filter(
                  (d) => !rowDims.includes(d.key)
                )}
                selected={colDim}
                onChange={setColDim}
                max={1}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">측정값</CardTitle>
            </CardHeader>
            <CardContent>
              <DimensionSelector
                title=""
                available={currentSchema.measures}
                selected={measures}
                onChange={setMeasures}
                max={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">필터</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterPanel
                dataset={dataset}
                dimensions={allSelectedDims}
                dimensionLabels={dimLabels}
                filters={filters}
                onChange={setFilters}
              />
            </CardContent>
          </Card>

          <button
            onClick={runQuery}
            disabled={loading || rowDims.length === 0 || measures.length === 0}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "분석 중..." : "분석 실행"}
          </button>
        </div>

        {/* 우측: 결과 */}
        <div className="lg:col-span-3">
          {result ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    분석 결과 ({result.totalRows.toLocaleString()}행)
                  </CardTitle>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        viewMode === "table"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      테이블
                    </button>
                    <button
                      onClick={() => setViewMode("chart")}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        viewMode === "chart"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      차트
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "table" ? (
                  <ResultTable
                    data={result.rows}
                    rowDims={rowDims}
                    colDim={colDim[0] ?? null}
                    measures={measures}
                    dimLabels={dimLabels}
                    measureLabels={measureLabels}
                  />
                ) : (
                  <ResultChart
                    data={result.rows}
                    rowDims={rowDims}
                    colDim={colDim[0] ?? null}
                    measures={measures}
                    dimLabels={dimLabels}
                    measureLabels={measureLabels}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center text-muted-foreground space-y-3">
                  <p className="text-lg font-medium">다차원 분석</p>
                  <p className="text-sm">
                    좌측에서 행 차원, 열 피벗, 측정값을 선택한 후<br />
                    &quot;분석 실행&quot; 버튼을 클릭하세요.
                  </p>
                  <div className="text-xs text-left max-w-md mx-auto space-y-2 pt-4">
                    <p className="font-medium">분석 예시:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>행: 연도 + 부서, 측정값: 생산량 → 부서별 연도 추이</li>
                      <li>행: 부서, 열 피벗: 연도, 측정값: 불량률 → 피벗 테이블</li>
                      <li>행: 거래선, 측정값: 출고수량 → 거래선별 판매 순위</li>
                      <li>행: 월, 열 피벗: 연도, 측정값: 출고수량 → 계절 비교</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
