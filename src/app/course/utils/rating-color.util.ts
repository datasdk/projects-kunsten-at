const ratingColors: Record<number, string> = {
  1: '#d73a31',
  2: '#f28c28',
  3: '#f0b904',
  4: '#9bbf30',
  5: '#2f9e44'
};

export function ratingColor(value: number | string | null | undefined): string {
  const rating = Math.max(1, Math.min(5, Math.round(Number(value) || 1)));
  return ratingColors[rating];
}
