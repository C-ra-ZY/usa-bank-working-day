import constants from "../src/constants";
import main, { createUsaBankWorkingDayToolKit, UsaBankWorkingDayToolKit } from "../src";
import { FixedDateHoliday, OrdinalHoliday } from "../src/constants";
import {
  CalendarOf2022,
  CalendarOf2026,
  CalendarOf2027,
  CalendarOf2028,
  isWeekendUtc,
  observedHolidayDates2022,
  observedHolidayDates2026,
  observedHolidayDates2027,
  observedHolidayDates2028,
} from "./fixtures/us-bank-holidays";

beforeEach(() => {
  main.ordinalHolidays = constants.ordinalHolidays;
  main.fixedDateHolidays = constants.fixedDateHolidays;
  main.cleanCache();
});
describe("module exports", () => {
  it("supports default singleton plus modern named exports", () => {
    expect(typeof main.isBankHoliday).toBe("function");

    const fromClass = new UsaBankWorkingDayToolKit();
    fromClass.ordinalHolidays = constants.ordinalHolidays;
    fromClass.fixedDateHolidays = constants.fixedDateHolidays;
    fromClass.cleanCache();

    const fromFactory = createUsaBankWorkingDayToolKit();
    fromFactory.ordinalHolidays = constants.ordinalHolidays;
    fromFactory.fixedDateHolidays = constants.fixedDateHolidays;
    fromFactory.cleanCache();

    expect(fromClass.isBankHoliday("2022-07-04")).toBe(true);
    expect(fromFactory.isBankHoliday("2022-07-04")).toBe(true);
    expect(main.isBankHoliday("2022-07-04")).toBe(true);

    expect(fromClass).not.toBe(main);
    expect(fromFactory).not.toBe(main);

  });
});

describe("ordinalHolidays unit test", () => {
  it("get and set", () => {
    const fromGetter = main.ordinalHolidays;
    expect(fromGetter).toEqual(constants.ordinalHolidays);
    expect(fromGetter).not.toBe(constants.ordinalHolidays);

    const getterSnapshot = main.ordinalHolidays;
    getterSnapshot.pop();
    expect(main.ordinalHolidays).toEqual(constants.ordinalHolidays);

    const getterSnapshotNested = main.ordinalHolidays;
    getterSnapshotNested[0].month = 11;
    expect(main.ordinalHolidays[0].month).toBe(constants.ordinalHolidays[0].month);

    let testArr = constants.ordinalHolidays.slice(0, 3).map((holiday) => ({ ...holiday }));
    main.ordinalHolidays = testArr;
    expect(main.ordinalHolidays).toEqual(testArr);

    testArr.pop();
    expect(main.ordinalHolidays).toHaveLength(3);

    testArr[0].month = 11;
    expect(main.ordinalHolidays[0].month).not.toBe(11);
  });
});

describe("fixedDateHolidays unit test", () => {
  it("get and set", () => {
    const fromGetter = main.fixedDateHolidays;
    expect(fromGetter).toEqual(constants.fixedDateHolidays);
    expect(fromGetter).not.toBe(constants.fixedDateHolidays);

    const getterSnapshot = main.fixedDateHolidays;
    getterSnapshot.pop();
    expect(main.fixedDateHolidays).toEqual(constants.fixedDateHolidays);

    const getterSnapshotNested = main.fixedDateHolidays;
    getterSnapshotNested[0].month = 11;
    expect(main.fixedDateHolidays[0].month).toBe(constants.fixedDateHolidays[0].month);

    let testArr = constants.fixedDateHolidays
      .slice(0, 3)
      .map((holiday) => ({ ...holiday }));
    main.fixedDateHolidays = testArr;
    expect(main.fixedDateHolidays).toEqual(testArr);

    testArr.pop();
    expect(main.fixedDateHolidays).toHaveLength(3);

    testArr[0].month = 11;
    expect(main.fixedDateHolidays[0].month).not.toBe(11);
  });
});

describe("getDateOfFixedDateHoliday unit test", () => {
  it("get right date: Christmas", () => {
    let christmas: FixedDateHoliday = {
      month: 11,
      date: 25,
      name: "Christmas Day",
    };
    let result = main.getDateOfFixedDateHoliday("2017-1-1", christmas);
    expect(result.getFullYear()).toEqual(2017);
    expect(result.getMonth()).toEqual(11);
    expect(result.getDate()).toEqual(25);
  });
});

describe("FixedDateHolidayAdjust unit test", () => {
  it("get right date: New Year", () => {
    let newYear = {
      month: 0,
      date: 1,
      name: "New Year's Day",
    };
    let result = main.fixedDateHolidayAdjust("2017-1-1"); // 2017-1-1 is a sunday, so the holiday should be postponed to the next day
    expect(result.getFullYear()).toEqual(2017);
    expect(result.getMonth()).toEqual(0);
    expect(result.getDate()).toEqual(2);
  });
});

describe("getDateOfOrdinalHoliday unit test", () => {
  it("get right date", () => {
    let wb: OrdinalHoliday = {
        month: 1,
        day: 1,
        ordinal: 3,
        name: "Washington's Birthday",
      },
      md: OrdinalHoliday = {
        month: 4,
        day: 1,
        ordinal: -1, //last
        name: "Memorial Day",
      };
    let result = main.getDateOfOrdinalHoliday("2019-1-1", wb);
    expect(result.getFullYear()).toEqual(2019);
    expect(result.getMonth()).toEqual(1);
    expect(result.getDate()).toEqual(18);
    result = main.getDateOfOrdinalHoliday("2019-1-1", md);
    expect(result.getFullYear()).toEqual(2019);
    expect(result.getMonth()).toEqual(4);
    expect(result.getDate()).toEqual(27);
  });

  it("get wrong date", () => {
    let wrongDay: OrdinalHoliday = {
      month: 1,
      day: 1,
      ordinal: 5,
      name: "Washington's Birthday",
    };
    expect(() => main.getDateOfOrdinalHoliday("2019-1-1", wrongDay)).toThrow(
      "ordinalHolidayObj has a pair of properties { day, ordinal } which leads to a date that exceeds limit of date for the specific month"
    );
  });
});

describe("Juneteenth", () => {
  it("is not a bank holiday before 2021", () => {
    expect(main.isBankHoliday("2020-6-19")).toBe(false);
  });

  it("is a bank holiday from 2021 (observed if weekend)", () => {
    expect(main.isBankHoliday("2021-6-18")).toBe(true);
    expect(main.isBankHoliday("2022-6-20")).toBe(true);
  });
});

describe("isBankHoliday unit test", () => {
  it("right parameter get right result", () => {
    expect(main.isBankHoliday("2010-12-31")).toBe(true);
    expect(main.isBankHoliday("2017-12-30")).toBe(true);
    expect(main.isBankHoliday("2017-12-1")).toBe(false);
    expect(main.isBankHoliday("2019-1-14")).toBe(false);
    expect(main.isBankHoliday("2018-12-25")).toBe(true);
    expect(main.isBankHoliday("2017-8-26")).toBe(true);
  });

  it("customized holidays are used by isBankHoliday", () => {
    main.fixedDateHolidays = [
      {
        month: 2,
        date: 2,
        name: "Christmas Day",
      },
    ];
    main.ordinalHolidays = [
      {
        month: 2,
        day: 2, // Tuesday
        ordinal: 2, // 2nd
        name: "Labor Day",
      },
    ];

    expect(main.isBankHoliday("2022-03-02")).toBe(true);
    expect(main.isBankHoliday("2022-03-08")).toBe(true);

    // July 4th 2022 is a Monday (weekday); defaults treat it as a fixed-date holiday.
    expect(main.isBankHoliday("2022-07-04")).toBe(false);
  });

  it("cache invalidates on holiday customization", () => {
    // Prime cache for 2022 using defaults.
    expect(main.isBankHoliday("2022-01-04")).toBe(false);
    expect(main.isBankHoliday("2022-07-04")).toBe(true);

    main.fixedDateHolidays = [
      {
        month: 2,
        date: 2,
        name: "Christmas Day",
      },
    ];

    expect(main.isBankHoliday("2022-07-04")).toBe(false);
    expect(main.isBankHoliday("2022-03-02")).toBe(true);
  });
});

describe("getLastWorkingDate unit test", () => {
  it("right parameter get right result", () => {
    expect(main.isBankHoliday("2017-1-2")).toBe(true);
    let lastWorkingDay = main.getLastWorkingDate("2017-1-2");
    expect(lastWorkingDay.getFullYear()).toBe(2016);
    expect(lastWorkingDay.getMonth()).toBe(11);
    expect(lastWorkingDay.getDate()).toBe(30);
    expect(main.isBankHoliday("2017-1-2")).toBe(true);
  });
});
describe("test with calendar of 2022", () => {
  it("include pre and next day", () => {
    for (let index = 0; index < CalendarOf2022.length; index++) {
      const dateStr = CalendarOf2022[index];
      const expected = isWeekendUtc(dateStr) || observedHolidayDates2022.has(dateStr);
      expect(main.isBankHoliday(dateStr)).toBe(expected);
    }
  });
});

describe("Observed-date edge cases", () => {
  it("dec 31 observed when jan 1 is saturday", () => {
    expect(main.isBankHoliday("2027-12-30")).toBe(false);
    expect(main.isBankHoliday("2027-12-31")).toBe(true);
    expect(main.isBankHoliday("2028-01-01")).toBe(true); // weekend + New Year's Day
  });

  it("independence day observed when july 4 is saturday (2026)", () => {
    expect(main.isBankHoliday("2026-07-02")).toBe(false);
    expect(main.isBankHoliday("2026-07-03")).toBe(true);
    expect(main.isBankHoliday("2026-07-04")).toBe(true); // weekend
  });

  it("veterans day observed when nov 11 is saturday (2028)", () => {
    expect(main.isBankHoliday("2028-11-10")).toBe(true);
    expect(main.isBankHoliday("2028-11-11")).toBe(true); // weekend
    expect(main.isBankHoliday("2028-11-14")).toBe(false);
  });

  it("july 4 observed when independence day is sunday (2027)", () => {
    expect(main.isBankHoliday("2027-07-03")).toBe(true);
    expect(main.isBankHoliday("2027-07-05")).toBe(true);
    expect(main.isBankHoliday("2027-07-06")).toBe(false);
  });

  it("christmas observed when dec 25 is saturday (2027)", () => {
    expect(main.isBankHoliday("2027-12-24")).toBe(true);
    expect(main.isBankHoliday("2027-12-25")).toBe(true);
    expect(main.isBankHoliday("2027-12-27")).toBe(false);
  });
});

describe("test with calendar of 2026", () => {
  it("calendar of 2026", () => {
    for (let index = 0; index < CalendarOf2026.length; index++) {
      const dateStr = CalendarOf2026[index];
      const expected = isWeekendUtc(dateStr) || observedHolidayDates2026.has(dateStr);
      expect(main.isBankHoliday(dateStr)).toBe(expected);
    }
  });
});

describe("test with calendar of 2027", () => {
  it("calendar of 2027", () => {
    for (let index = 0; index < CalendarOf2027.length; index++) {
      const dateStr = CalendarOf2027[index];
      const expected = isWeekendUtc(dateStr) || observedHolidayDates2027.has(dateStr);
      expect(main.isBankHoliday(dateStr)).toBe(expected);
    }
  });
});

describe("test with calendar of 2028", () => {
  it("calendar of 2028", () => {
    for (let index = 0; index < CalendarOf2028.length; index++) {
      const dateStr = CalendarOf2028[index];
      const expected = isWeekendUtc(dateStr) || observedHolidayDates2028.has(dateStr);
      expect(main.isBankHoliday(dateStr)).toBe(expected);
    }
  });
});
