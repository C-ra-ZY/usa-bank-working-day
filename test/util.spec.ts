import { setYMD, parseDate } from "../src/utils";

describe("parseDate unit test", () => {
  it("parseDate with wrong paramter", (done) => {
    let parsedDate;
    try {
      parsedDate = parseDate(undefined as unknown as string);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "only accept a date in string format: yyyy-mm-dd or yyyy-m-d"
      );
    }
    done();
  });
  it("parseDate with right parameter", (done) => {
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
    done();
  });
});

describe("setYMD unit test", () => {
  it("wrong parameter", (done) => {
    try {
      setYMD(2.7976931348623157e308, 1, 1);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of year"
      );
    }

    try {
      setYMD(2017, 2.7976931348623157e308, 1);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of month, and the number shall be in [0,11]"
      );
    }

    try {
      setYMD(2017, -1, 1);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of month, and the number shall be in [0,11]"
      );
    }

    try {
      setYMD(2017, 12, 1);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of month, and the number shall be in [0,11]"
      );
    }

    try {
      setYMD(2017, 11, -1);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of date, and the number shall be in [0,31]"
      );
    }

    try {
      setYMD(2017, 11, 32);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of date, and the number shall be in [0,31]"
      );
    }

    try {
      setYMD(2017, 11, 2.7976931348623157e308);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of date, and the number shall be in [0,31]"
      );
    }

    try {
      setYMD(2017, 2, 29);
    } catch (err) {
      expect<string>((err as any).message as string).toBe(
        "this function requires a safe integer of date, and the number shall be in [0,31]"
      );
    }
    done();
  });
});
