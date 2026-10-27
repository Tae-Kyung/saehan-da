export function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_0000_0000) {
    return (n / 1_0000_0000).toFixed(2) + "억";
  }
  if (Math.abs(n) >= 1_0000) {
    return (n / 1_0000).toFixed(0) + "만";
  }
  return n.toLocaleString();
}

export function formatFullNumber(n: number): string {
  return n.toLocaleString();
}

export const MONTH_LABELS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export const DEPT_COLORS: Record<string, string> = {
  "1211": "var(--chart-1)",
  "1212": "var(--chart-3)",
  "1219": "var(--chart-5)",
};

export const CHART_COLORS = [
  "#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c",
  "#0891b2", "#4f46e5", "#059669", "#d97706", "#be185d",
  "#7c3aed", "#0d9488", "#b91c1c", "#7c2d12", "#4338ca",
];
