import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            새한프라텍 생산·판매 분석 대시보드
          </h1>
          <p className="text-muted-foreground mt-1">
            2021~2025년 생산실적 및 판매실적 종합 분석
          </p>
        </header>
        <Dashboard />
      </div>
    </main>
  );
}
