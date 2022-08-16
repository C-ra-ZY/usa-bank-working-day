import { parseDate, setYMD } from "./utils";
import presetHolidays, { FixedDateHoliday, OrdinalHoliday } from "./constants";

const {
  ordinalHolidays: _ordinalHolidays,
  fixedDateHolidays: _fixedDateHolidays,
} = presetHolidays;

function validateTargetYearDate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any) => any>
) {
  let method = descriptor.value!;
  descriptor.value = function () {
    if (arguments && arguments.length >= 1) {
      return method.apply(
        this,
        arguments[0] instanceof Date
          ? Array.from(arguments)
          : [
              parseDate(arguments[0] as string),
              ...Array.prototype.slice.apply(arguments, [1]),
            ]
      );
    } else {
      throw Error(
        "only accept a date in string format: yyyy-mm-dd or yyyy-m-d"
      );
    }
  };
}

class UsaBankWorkingDayToolKit {
  private customizedOrdinalHolidays: OrdinalHoliday[] = _ordinalHolidays;
  private customizedFixedDateHolidays: FixedDateHoliday[] = _fixedDateHolidays;
  private holidayCache: Map<string, Array<Date>> = new Map();

  @validateTargetYearDate
  getLastWorkingDate(...args: any[]) {
    const targetYearDate: Date = args[0];
    let targetDate = setYMD(
      targetYearDate.getFullYear(),
      targetYearDate.getMonth(),
      targetYearDate.getDate() - 1
    );
    while (this.isBankHoliday(targetDate)) {
      targetDate = setYMD(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate() - 1
      );
    }
    return targetDate;
  }

  @validateTargetYearDate
  isBankHoliday(...args: any[]) {
    const targetYearDate: Date = args[0];
    const fullYearKey = `${targetYearDate.getFullYear()}`;
    if (!this.holidayCache.has(fullYearKey)) {
      this.holidayCache.set(fullYearKey, []);
    }
    if (
      this.holidayCache.get(fullYearKey)!.length <
      _ordinalHolidays.length + _fixedDateHolidays.length
    ) {
      this.holidayCache.set(
        fullYearKey,
        _ordinalHolidays
          .map((oh) => this.getDateOfOrdinalHoliday(targetYearDate, oh))
          .concat(
            _fixedDateHolidays.map((fdh) =>
              this.fixedDateHolidayAdjust(
                this.getDateOfFixedDateHoliday(targetYearDate, fdh)
              )
            )
          )
      );
    }

    let holidays = this.holidayCache.get(fullYearKey);

    if (
      targetYearDate.getMonth() == 11 &&
      targetYearDate.getDate() == 31 &&
      targetYearDate.getDay() == 5
    ) {
      return true;
    }
    if (
      holidays &&
      holidays.some(
        (hd) =>
          hd.getFullYear() == targetYearDate.getFullYear() &&
          hd.getMonth() == targetYearDate.getMonth() &&
          hd.getDate() == targetYearDate.getDate()
      )
    ) {
      return true;
    }
    if (targetYearDate.getDay() == 6 || targetYearDate.getDay() == 0) {
      return true;
    }
    return false;
  }

  @validateTargetYearDate
  fixedDateHolidayAdjust(...args: any[]) {
    const targetYearDate: Date = args[0];
    let year = targetYearDate.getFullYear(),
      month = targetYearDate.getMonth(),
      date = targetYearDate.getDate(),
      day = targetYearDate.getDay(),
      adjustNum = 0;
    if (day === 0) {
      adjustNum = 1;
    } else if (day === 6) {
      adjustNum = -1;
    }
    return setYMD(year, month, date + adjustNum);
  }

  @validateTargetYearDate
  getDateOfFixedDateHoliday(...args: any[]) {
    const targetYearDate: Date = args[0];
    const fixedDateHolidayObj: FixedDateHoliday = args[1];
    let year = targetYearDate.getFullYear(),
      month = fixedDateHolidayObj.month,
      date = fixedDateHolidayObj.date;
    return setYMD(year, month, date);
  }

  @validateTargetYearDate
  getDateOfOrdinalHoliday(...args: any[]) {
    const targetYearDate: Date = args[0];
    const ordinalHolidayObj: OrdinalHoliday = args[1];
    let year = targetYearDate.getFullYear(),
      { month, ordinal, day } = ordinalHolidayObj,
      template = setYMD(year, month, 1),
      firstDateDay = template.getDay(),
      targetDate;
    if (ordinal < 0) {
      let lastDateOfMonth = setYMD(year, month + 1, 0),
        totalDateNumberInMonth = lastDateOfMonth.getDate(),
        fifthOrdinals: number[] = [],
        dayIndex = 0;
      while (dayIndex < totalDateNumberInMonth % 7) {
        fifthOrdinals.push((firstDateDay + dayIndex++) % 7);
      }
      ordinal += 5 + Math.ceil((fifthOrdinals.indexOf(day) + 1) / 7);
    }
    targetDate =
      (ordinal + Math.floor((firstDateDay - day - 1) / 7)) * 7 +
      day -
      firstDateDay +
      1;
    template.setDate(targetDate);
    if (template.getMonth() != month) {
      throw Error(
        "ordinalHolidayObj has a pair of properties { day, ordinal } which leads to a date that exceeds limit of date for the specific month"
      );
    }
    return template;
  }

  cleanCache() {
    this.holidayCache.clear();
  }
  get ordinalHolidays() {
    return this.customizedOrdinalHolidays;
  }
  get fixedDateHolidays() {
    return this.customizedFixedDateHolidays;
  }
  set ordinalHolidays(param) {
    this.customizedOrdinalHolidays = param;
  }
  set fixedDateHolidays(param) {
    this.customizedFixedDateHolidays = param;
  }
}

export default new UsaBankWorkingDayToolKit();
