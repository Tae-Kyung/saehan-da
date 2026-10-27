# 새한 생산계획 수립 시스템

## 프로젝트 개요
새한(포장용기 제조) 5년간(2021~2025) 생산·판매 실적 데이터를 분석하여 생산계획 수립을 지원하는 웹 애플리케이션.

## 기술 스택
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (외부) — `postgresql://kbsi_app:SMmQhkEIeXivl5P0yrHWW1JhpwCcmWQg@203.255.78.89:15432/saehan?sslmode=require`
- **ORM**: Drizzle ORM + drizzle-kit
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Deploy**: Vercel

## 프로젝트 구조
```
saehane-da/
├── docs/                    # 요구사항, PRD, 원본 데이터
│   ├── data/                # 원본 Excel(TSV) 파일 20개
│   ├── requirement.md
│   └── PRD.md
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx         # 메인 대시보드
│   │   ├── api/             # API routes
│   │   └── (routes)/        # 페이지 라우트 그룹
│   ├── components/          # React 컴포넌트
│   │   ├── ui/              # shadcn/ui 컴포넌트
│   │   └── charts/          # 차트 컴포넌트
│   ├── db/
│   │   ├── schema.ts        # Drizzle 스키마 정의
│   │   ├── index.ts         # DB 커넥션
│   │   └── migrations/      # Drizzle 마이그레이션
│   ├── lib/                 # 유틸리티, 헬퍼
│   └── scripts/             # ETL 스크립트 (데이터 적재)
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

## 코딩 컨벤션
- 함수/변수: camelCase, 컴포넌트: PascalCase, 파일: kebab-case
- DB 테이블/컬럼: snake_case (영문)
- 한국어 주석 사용 가능, 코드는 영문
- `"use client"` 는 클라이언트 컴포넌트에만 명시, 서버 컴포넌트가 기본
- API 응답 형식: `{ data, error, meta }` 패턴

## DB 스키마 (구현 완료)
- `production_records` — 생산실적 (16 data 컬럼 + id)
- `sales_records` — 판매실적 (16 data 컬럼 + id)
- `departments` — 부서 마스터 (code, name, material, is_active)
- enum: `department_code` (1211/1212/1219), `shipment_type` (정상/반품), `slip_type` (21/22/32)
- 스키마 정의: `src/db/schema.ts`, 커넥션: `src/db/index.ts`

## 데이터 특이사항
- 원본 파일은 .xls 확장자지만 실제 TSV(탭 구분) + CP949/EUC-KR 인코딩
- 각 파일 마지막 행에 합계 행 존재 (생산일자/출고일자가 NaN 또는 "합 계") — ETL 시 제외 필요
- 판매실적의 반품은 출고수량이 음수
- 생산실적 3개 부서만 포함, 판매실적에는 캡/라벨 등 부자재 포함 → 직접 수량 비교 불가
- 1212 PE팀은 2024년 이후 급감 (축소/이관)

## 개발 명령어
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run db:generate  # Drizzle 마이그레이션 생성
npm run db:push      # 스키마 DB에 push
npm run db:studio    # Drizzle Studio
npm run etl          # 데이터 적재 스크립트
```

## 환경변수
```
DATABASE_URL=postgresql://kbsi_app:SMmQhkEIeXivl5P0yrHWW1JhpwCcmWQg@203.255.78.89:15432/saehan?sslmode=require
```

## 주의사항
- DB 접속 정보가 코드에 하드코딩되지 않도록 반드시 .env 사용
- .env 파일은 .gitignore에 포함
- Vercel 배포 시 환경변수는 Vercel Dashboard에서 설정
- 대량 데이터 쿼리 시 페이지네이션 적용
- 차트 렌더링은 클라이언트 컴포넌트에서 처리
