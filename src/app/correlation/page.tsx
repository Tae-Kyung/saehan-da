import { CorrelationPageClient } from "@/components/correlation/correlation-page-client";

export default function CorrelationPage() {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            생산-판매 상관분석
          </h1>
          <p className="text-muted-foreground mt-1">
            생산량과 판매량의 상관관계, 계절 패턴, 리드타임 분석
          </p>
        </header>
        <CorrelationPageClient />
      </div>
    </main>
  );
}
