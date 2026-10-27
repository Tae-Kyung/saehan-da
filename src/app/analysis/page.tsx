import { AnalysisPageClient } from "@/components/analysis/analysis-page-client";

export default function AnalysisPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">다차원 분석</h1>
          <p className="text-muted-foreground mt-1">
            생산·판매 데이터의 다차원 피벗 분석
          </p>
        </header>
        <AnalysisPageClient />
      </div>
    </main>
  );
}
