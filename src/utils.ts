import { dateExists } from "date-exists";

export const DateRegExp =
  /^(\d+)\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

export interface Ymd {
  year: number;
  month: number;
  day: number;
}

function createLocalCivilDate(year: number, month: number, date: number) {
  // Use local noon to avoid DST and timezone edge cases around midnight.
  return new Date(year, month, date, 12, 0, 0, 0);
}

export function setYMD(year: number, month: number, date: number) {
  if (!Number.isSafeInteger(year)) {
    throw Error("this function requires a safe integer of year");
  }
  if (!Number.isSafeInteger(month) || month > 11 || month < 0) {
    throw Error(
      "this function requires a safe integer of month, and the number shall be in [0,11]"
    );
  }
  if (!Number.isSafeInteger(date) || date > 31 || date < 0) {
    throw Error(
      "this function requires a safe integer of date, and the number shall be in [0,31]"
    );
  }
  if (!dateExists(`${date}/${month + 1}/${year}`)) {
    date !== 0 &&
      (() => {
        throw Error(`your date ${date}/${month}/${year} is not existing`);
      })();
  }

  return createLocalCivilDate(year, month, date);
}

export function toYmd(targetDate: Date): Ymd {
  return {
    year: targetDate.getFullYear(),
    month: targetDate.getMonth(),
    day: targetDate.getDate(),
  };
}

export function fromYmd(targetDate: Ymd): Date {
  return setYMD(targetDate.year, targetDate.month, targetDate.day);
}

export function ymdKey(targetDate: Ymd): string {
  const month = String(targetDate.month + 1).padStart(2, "0");
  const day = String(targetDate.day).padStart(2, "0");
  return `${targetDate.year}-${month}-${day}`;
}

export function ymdKeyFromDate(targetDate: Date): string {
  return ymdKey(toYmd(targetDate));
}

export function addDaysYmd(targetDate: Ymd, deltaDays: number): Ymd {
  const dt = new Date(
    Date.UTC(targetDate.year, targetDate.month, targetDate.day + deltaDays)
  );
  return {
    year: dt.getUTCFullYear(),
    month: dt.getUTCMonth(),
    day: dt.getUTCDate(),
  };
}

export function weekdayFromYmd(targetDate: Ymd): number {
  return new Date(Date.UTC(targetDate.year, targetDate.month, targetDate.day)).getUTCDay();
}

export function parseDate(targetDate: string) {
  if (!DateRegExp.test(targetDate)) {
    throw Error("only accept a date in string format: yyyy-mm-dd or yyyy-m-d");
  }

  const match = targetDate.match(DateRegExp);
  if (!match) {
    throw Error("only accept a date in string format: yyyy-mm-dd or yyyy-m-d");
  }

  const year = +match[1];
  const month = +match[2] - 1;
  const date = +match[3];

  return setYMD(year, month, date);
}
