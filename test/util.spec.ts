import { addDaysYmd, setYMD, parseDate, toYmd, weekdayFromYmd } from "../src/utils";

describe("date semantics contract", () => {
  it("parseDate interprets yyyy-mm-dd as a local calendar date", () => {
    const parsed = parseDate("2017-11-27");
    expect(parsed.getFullYear()).toBe(2017);
    expect(parsed.getMonth()).toBe(10);
    expect(parsed.getDate()).toBe(27);
  });

  it("parseDate and setYMD share deterministic local-civil semantics", () => {
    const fromString = parseDate("2017-1-2");
    const fromParts = setYMD(2017, 0, 2);

    expect(fromString.getFullYear()).toBe(fromParts.getFullYear());
    expect(fromString.getMonth()).toBe(fromParts.getMonth());
    expect(fromString.getDate()).toBe(fromParts.getDate());

    // Deterministic time-of-day to avoid DST / timezone issues.
    expect(fromString.getHours()).toBe(12);
    expect(fromParts.getHours()).toBe(12);

  });
});

describe("parseDate unit test", () => {
  it("parseDate with wrong paramter", () => {
    expect(() => parseDate(undefined as unknown as string)).toThrow(
      "only accept a date in string format: yyyy-mm-dd or yyyy-m-d"
    );
  });
  it("parseDate with right parameter", () => {
    var parsedDate = parseDate("2017-11-27");
    expect(parsedDate.getDate()).toBe(+"27");
    expect(parsedDate.getFullYear()).toBe(+"2017");
    expect(parsedDate.getMonth()).toBe(+"10");

    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    parsedDate = parseDate(todayDateString);
    expect(parsedDate.getDate()).toBe(today.getDate());
    expect(parsedDate.getFullYear()).toBe(today.getFullYear());
    expect(parsedDate.getMonth()).toBe(today.getMonth());
  });
});

describe("setYMD unit test", () => {
  it("wrong parameter", () => {
    expect(() => setYMD(2.7976931348623157e308, 1, 1)).toThrow(
      "this function requires a safe integer of year"
    );

    expect(() => setYMD(2017, 2.7976931348623157e308, 1)).toThrow(
      "this function requires a safe integer of month, and the number shall be in [0,11]"
    );

    expect(() => setYMD(2017, -1, 1)).toThrow(
      "this function requires a safe integer of month, and the number shall be in [0,11]"
    );

    expect(() => setYMD(2017, 12, 1)).toThrow(
      "this function requires a safe integer of month, and the number shall be in [0,11]"
    );

    expect(() => setYMD(2017, 11, -1)).toThrow(
      "this function requires a safe integer of date, and the number shall be in [0,31]"
    );

    expect(() => setYMD(2017, 11, 32)).toThrow(
      "this function requires a safe integer of date, and the number shall be in [0,31]"
    );

    expect(() => setYMD(2017, 11, 2.7976931348623157e308)).toThrow(
      "this function requires a safe integer of date, and the number shall be in [0,31]"
    );

    expect(() => setYMD(2017, 1, 29)).toThrow(
      "your date 29/1/2017 is not existing"
    );
  });
});

describe("weekdayFromYmd unit test", () => {
  it("matches Date.getDay semantics for known weekdays", () => {
    expect(weekdayFromYmd(toYmd(parseDate("2022-07-04")))).toBe(1);
    expect(weekdayFromYmd(toYmd(parseDate("2022-07-03")))).toBe(0);
    expect(weekdayFromYmd(toYmd(parseDate("2022-07-02")))).toBe(6);
  });
});

describe("addDaysYmd unit test", () => {
  it("handles cross-month, cross-year, and leap-year transitions", () => {
    expect(addDaysYmd(toYmd(parseDate("2022-12-31")), 1)).toEqual({
      year: 2023,
      month: 0,
      day: 1,
    });

    expect(addDaysYmd(toYmd(parseDate("2023-01-01")), -1)).toEqual({
      year: 2022,
      month: 11,
      day: 31,
    });

    expect(addDaysYmd(toYmd(parseDate("2020-02-28")), 1)).toEqual({
      year: 2020,
      month: 1,
      day: 29,
    });

    expect(addDaysYmd(toYmd(parseDate("2021-02-28")), 1)).toEqual({
      year: 2021,
      month: 2,
      day: 1,
    });
  });
});
