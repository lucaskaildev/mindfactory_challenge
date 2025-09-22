export function DateToYYYYMM(value: Date): number {
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  return year * 100 + month;
}

export function YYYYMMToDate(value: number): Date {
  const year = Math.floor(value / 100); // we obtain something like 2025.09 and round it down
  const month = value % 100; // we obtain the last two digits, something like 9 if value is 202509
  return new Date(year, month - 1, 1);
}
