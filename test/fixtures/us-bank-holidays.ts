function pad2(num: number): string {
  return String(num).padStart(2, "0");
}

function toYmdUtc(date: Date): string {
  return [
    String(date.getUTCFullYear()),
    pad2(date.getUTCMonth() + 1),
    pad2(date.getUTCDate()),
  ].join("-");
}

function parseYmd(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    throw new Error("invalid y-m-d date string in test fixture");
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  return { year, month, day };
}

export function isWeekendUtc(dateStr: string): boolean {
  const { year, month, day } = parseYmd(dateStr);
  const dt = new Date(Date.UTC(year, month - 1, day));
  const weekday = dt.getUTCDay();
  return weekday === 0 || weekday === 6;
}

function buildCalendarWithBounds(year: number): string[] {
  const start = new Date(Date.UTC(year - 1, 11, 31));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const out: string[] = [];
  for (
    let dt = start;
    dt.getTime() <= end.getTime();
    dt = new Date(dt.getTime() + 24 * 60 * 60 * 1000)
  ) {
    out.push(toYmdUtc(dt));
  }

  return out;
}

export const CalendarOf2022 = buildCalendarWithBounds(2022);
export const observedHolidayDates2022 = new Set<string>([
  "2021-12-31",
  "2022-06-20",
  "2022-07-04",
  "2022-11-11",
  "2022-12-26",
  "2022-01-17",
  "2022-02-21",
  "2022-05-30",
  "2022-09-05",
  "2022-10-10",
  "2022-11-24",
]);

export const CalendarOf2026 = buildCalendarWithBounds(2026);
export const observedHolidayDates2026 = new Set<string>([
  "2026-01-01",
  "2026-06-19",
  "2026-07-03",
  "2026-11-11",
  "2026-12-25",
  "2026-01-19",
  "2026-02-16",
  "2026-05-25",
  "2026-09-07",
  "2026-10-12",
  "2026-11-26",
  "2027-01-01",
]);

export const CalendarOf2027 = buildCalendarWithBounds(2027);
export const observedHolidayDates2027 = new Set<string>([
  "2027-01-01",
  "2027-06-18",
  "2027-07-05",
  "2027-11-11",
  "2027-12-24",
  "2027-01-18",
  "2027-02-15",
  "2027-05-31",
  "2027-09-06",
  "2027-10-11",
  "2027-11-25",
  "2027-12-31",
]);

export const CalendarOf2028 = buildCalendarWithBounds(2028);
export const observedHolidayDates2028 = new Set<string>([
  "2027-12-31",
  "2028-06-19",
  "2028-07-04",
  "2028-11-10",
  "2028-12-25",
  "2028-01-17",
  "2028-02-21",
  "2028-05-29",
  "2028-09-04",
  "2028-10-09",
  "2028-11-23",
  "2029-01-01",
]);
