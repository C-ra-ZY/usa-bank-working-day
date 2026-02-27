import { addDaysYmd, fromYmd, parseDate, toYmd, Ymd, ymdKey } from "./utils";
import presetHolidays, { FixedDateHoliday, OrdinalHoliday } from "./constants";
import {
  fixedDateHolidayAdjust as fixedDateHolidayAdjustRule,
  getDateOfFixedDateHoliday as getDateOfFixedDateHolidayRule,
  getDateOfOrdinalHoliday as getDateOfOrdinalHolidayRule,
  isHolidayEffectiveInYear,
  isSpecialObservedNewYearsEve,
  isWeekend,
} from "./rules";

const {
  ordinalHolidays: _ordinalHolidays,
  fixedDateHolidays: _fixedDateHolidays,
} = presetHolidays;

function normalizeTargetYmd(targetYearDate: Date | string): Ymd {
  if (targetYearDate instanceof Date) {
    return toYmd(targetYearDate);
  }

  if (typeof targetYearDate === "string") {
    return toYmd(parseDate(targetYearDate));
  }

  throw Error("only accept a date in string format: yyyy-mm-dd or yyyy-m-d");
}

function cloneOrdinalHolidays(param: OrdinalHoliday[]): OrdinalHoliday[] {
  return param.map((holiday) => ({ ...holiday }));
}

function cloneFixedDateHolidays(param: FixedDateHoliday[]): FixedDateHoliday[] {
  return param.map((holiday) => ({ ...holiday }));
}

export class UsaBankWorkingDayToolKit {
  private customizedOrdinalHolidays: OrdinalHoliday[] = cloneOrdinalHolidays(
    _ordinalHolidays
  );
  private customizedFixedDateHolidays: FixedDateHoliday[] =
    cloneFixedDateHolidays(_fixedDateHolidays);
  private holidayCache: Map<number, Set<string>> = new Map();

  private getHolidaysForYear(targetYear: number): Set<string> {
    const fullYearKey = targetYear;

    let holidays = this.holidayCache.get(fullYearKey);
    if (!holidays) {
      const ordinalHolidays = this.customizedOrdinalHolidays.filter((oh) =>
        isHolidayEffectiveInYear(oh, targetYear)
      );
      const fixedDateHolidays = this.customizedFixedDateHolidays.filter((fdh) =>
        isHolidayEffectiveInYear(fdh, targetYear)
      );

      const holidayDates = ordinalHolidays
        .map((oh) => getDateOfOrdinalHolidayRule(targetYear, oh))
        .concat(
          fixedDateHolidays.map((fdh) =>
            fixedDateHolidayAdjustRule(getDateOfFixedDateHolidayRule(targetYear, fdh))
          )
        );

      holidays = new Set<string>(holidayDates.map((holidayDate) => ymdKey(holidayDate)));

      this.holidayCache.set(fullYearKey, holidays);
    }

    return holidays;
  }

  private isBankHolidayYmd(targetYearDate: Ymd): boolean {
    const holidays = this.getHolidaysForYear(targetYearDate.year);

    if (isSpecialObservedNewYearsEve(targetYearDate)) {
      return true;
    }

    if (holidays.has(ymdKey(targetYearDate))) {
      return true;
    }

    if (isWeekend(targetYearDate)) {
      return true;
    }
    return false;
  }

  getLastWorkingDate(targetYearDate: Date): Date;
  getLastWorkingDate(targetYearDate: string): Date;
  getLastWorkingDate(targetYearDate: Date | string): Date {
    let targetYmd = addDaysYmd(normalizeTargetYmd(targetYearDate), -1);
    while (this.isBankHolidayYmd(targetYmd)) {
      targetYmd = addDaysYmd(targetYmd, -1);
    }
    return fromYmd(targetYmd);
  }

  isBankHoliday(targetYearDate: Date): boolean;
  isBankHoliday(targetYearDate: string): boolean;
  isBankHoliday(targetYearDate: Date | string): boolean {
    return this.isBankHolidayYmd(normalizeTargetYmd(targetYearDate));
  }

  fixedDateHolidayAdjust(targetYearDate: Date): Date;
  fixedDateHolidayAdjust(targetYearDate: string): Date;
  fixedDateHolidayAdjust(targetYearDate: Date | string): Date {
    return fromYmd(fixedDateHolidayAdjustRule(normalizeTargetYmd(targetYearDate)));
  }

  getDateOfFixedDateHoliday(
    targetYearDate: Date,
    fixedDateHolidayObj: FixedDateHoliday
  ): Date;
  getDateOfFixedDateHoliday(
    targetYearDate: string,
    fixedDateHolidayObj: FixedDateHoliday
  ): Date;
  getDateOfFixedDateHoliday(
    targetYearDate: Date | string,
    fixedDateHolidayObj: FixedDateHoliday
  ): Date {
    return fromYmd(
      getDateOfFixedDateHolidayRule(normalizeTargetYmd(targetYearDate).year, fixedDateHolidayObj)
    );
  }

  getDateOfOrdinalHoliday(
    targetYearDate: Date,
    ordinalHolidayObj: OrdinalHoliday
  ): Date;
  getDateOfOrdinalHoliday(
    targetYearDate: string,
    ordinalHolidayObj: OrdinalHoliday
  ): Date;
  getDateOfOrdinalHoliday(
    targetYearDate: Date | string,
    ordinalHolidayObj: OrdinalHoliday
  ): Date {
    return fromYmd(
      getDateOfOrdinalHolidayRule(normalizeTargetYmd(targetYearDate).year, ordinalHolidayObj)
    );
  }

  cleanCache() {
    this.holidayCache.clear();
  }
  get ordinalHolidays() {
    return cloneOrdinalHolidays(this.customizedOrdinalHolidays);
  }
  get fixedDateHolidays() {
    return cloneFixedDateHolidays(this.customizedFixedDateHolidays);
  }
  set ordinalHolidays(param) {
    this.customizedOrdinalHolidays = cloneOrdinalHolidays(param);
    this.cleanCache();
  }
  set fixedDateHolidays(param) {
    this.customizedFixedDateHolidays = cloneFixedDateHolidays(param);
    this.cleanCache();
  }
}

export function createUsaBankWorkingDayToolKit(): UsaBankWorkingDayToolKit {
  return new UsaBankWorkingDayToolKit();
}

export default createUsaBankWorkingDayToolKit();
