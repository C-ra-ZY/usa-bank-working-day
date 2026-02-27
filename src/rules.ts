import { FixedDateHoliday, OrdinalHoliday } from "./constants";
import { setYMD, toYmd, weekdayFromYmd, Ymd } from "./utils";

export interface EffectiveYearHoliday {
  effectiveFromYear?: number;
  effectiveToYear?: number;
}

export function isHolidayEffectiveInYear(
  holiday: EffectiveYearHoliday,
  year: number
) {
  if (holiday.effectiveFromYear !== undefined && year < holiday.effectiveFromYear) {
    return false;
  }
  if (holiday.effectiveToYear !== undefined && year > holiday.effectiveToYear) {
    return false;
  }
  return true;
}

export function fixedDateHolidayAdjust(targetYearDate: Ymd): Ymd {
  const year = targetYearDate.year;
  const month = targetYearDate.month;
  const date = targetYearDate.day;
  const day = weekdayFromYmd(targetYearDate);
  let adjustNum = 0;

  if (day === 0) {
    adjustNum = 1;
  } else if (day === 6) {
    adjustNum = -1;
  }

  return toYmd(setYMD(year, month, date + adjustNum));
}

export function getDateOfFixedDateHoliday(
  targetYear: number,
  fixedDateHolidayObj: FixedDateHoliday
): Ymd {
  const year = targetYear;
  const month = fixedDateHolidayObj.month;
  const date = fixedDateHolidayObj.date;

  return toYmd(setYMD(year, month, date));
}

export function getDateOfOrdinalHoliday(
  targetYear: number,
  ordinalHolidayObj: OrdinalHoliday
): Ymd {
  const year = targetYear;
  const month = ordinalHolidayObj.month;
  const day = ordinalHolidayObj.day;
  let ordinal = ordinalHolidayObj.ordinal;
  const template = setYMD(year, month, 1);
  const firstDateDay = template.getDay();
  let targetDate: number;

  if (ordinal < 0) {
    const lastDateOfMonth = setYMD(year, month + 1, 0);
    const totalDateNumberInMonth = lastDateOfMonth.getDate();
    const fifthOrdinals: number[] = [];
    let dayIndex = 0;

    while (dayIndex < totalDateNumberInMonth % 7) {
      fifthOrdinals.push((firstDateDay + dayIndex++) % 7);
    }

    ordinal += 5 + Math.ceil((fifthOrdinals.indexOf(day) + 1) / 7);
  }

  targetDate =
    (ordinal + Math.floor((firstDateDay - day - 1) / 7)) * 7 + day - firstDateDay + 1;

  template.setDate(targetDate);
  if (template.getMonth() != month) {
    throw Error(
      "ordinalHolidayObj has a pair of properties { day, ordinal } which leads to a date that exceeds limit of date for the specific month"
    );
  }

  return toYmd(template);
}

export function isSpecialObservedNewYearsEve(targetYearDate: Ymd): boolean {
  return (
    targetYearDate.month == 11 &&
    targetYearDate.day == 31 &&
    weekdayFromYmd(targetYearDate) == 5
  );
}

export function isWeekend(targetYearDate: Ymd): boolean {
  const weekDay = weekdayFromYmd(targetYearDate);
  return weekDay == 6 || weekDay == 0;
}
