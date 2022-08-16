import { dateExists } from "date-exists";

export const DateRegExp =
  /^(\d+)\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

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
  let tempDate = new Date();
  tempDate.setDate(1);
  tempDate.setFullYear(year);
  tempDate.setMonth(month);
  tempDate.setDate(date);
  return tempDate;
}

export function parseDate(targetDate: string) {
  if (!DateRegExp.test(targetDate)) {
    throw Error("only accept a date in string format: yyyy-mm-dd or yyyy-m-d");
  }
  return new Date(targetDate + "Z");
}
