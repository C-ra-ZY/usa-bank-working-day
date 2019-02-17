const chai = require("chai"),
	expect = chai.expect,
	assert = chai.assert,
	should = chai.should(),
	main = require("../src"),
	constants = require("../src/presetConstant");

beforeEach(() => {
	main.ordinalHolidays = constants.ordinalHolidays;
	main.fixedDateHolidays = constants.fixedDateHolidays;
	main.cleanCache();
});

describe("ordinalHolidays unit test", () => {
	it("get and set", (done) => {
		assert.equal(main.ordinalHolidays, constants.ordinalHolidays);
		let testArr = constants.ordinalHolidays.slice(0, 3);
		main.ordinalHolidays = testArr;
		assert.equal(main.ordinalHolidays, testArr);
		done();
	});
});

describe("fixedDateHolidays unit test", () => {
	it("get and set", (done) => {
		assert.equal(main.fixedDateHolidays, constants.fixedDateHolidays);
		let testArr = constants.fixedDateHolidays.slice(0, 3);
		main.fixedDateHolidays = testArr;
		assert.equal(main.fixedDateHolidays, testArr);
		done();
	});
});

describe("getDateOfFixedDateHoliday unit test", () => {
	it("get right date", (done) => {
		let christmas = {
			month: 11,
			date: 25,
			name: "Christmas Day"
		};
		let result = main.getDateOfFixedDateHoliday("2017-1-1", christmas);
		assert.equal(result.getFullYear(), 2017);
		assert.equal(result.getMonth(), 11);
		assert.equal(result.getDate(), 25);
		done();
	});
});

describe("FixedDateHolidayAdjust unit test", () => {
	it("get right date", (done) => {
		let newYear = {
			month: 0,
			date: 1,
			name: "New Year's Day"
		};
		let result = main.fixedDateHolidayAdjust(Number(main.getDateOfFixedDateHoliday("2017-1-1", newYear)));
		assert.equal(result.getFullYear(), 2017);
		assert.equal(result.getMonth(), 0);
		assert.equal(result.getDate(), 2);
		done();
	});
});

describe("getDateOfOrdinalHoliday unit test", () => {
	it("get right date", (done) => {
		let wb = {
				month: 1,
				day: 1,
				ordinal: 3,
				name: "Washington's Birthday"
			},
			md = {
				month: 4,
				day: 1,
				ordinal: -1, //last
				name: "Memorial Day"
			};
		let result = main.getDateOfOrdinalHoliday("2019-1-1", wb);
		assert.equal(result.getFullYear(), 2019);
		assert.equal(result.getMonth(), 1);
		assert.equal(result.getDate(), 18);
		result = main.getDateOfOrdinalHoliday("2019-1-1", md);
		assert.equal(result.getFullYear(), 2019);
		assert.equal(result.getMonth(), 4);
		assert.equal(result.getDate(), 27);
		done();
	});

	it("get wrong date", (done) => {
		let wrongDay = {
			month: 1,
			day: 1,
			ordinal: 5,
			name: "wrong Day"
		};
		try {
			let result = main.getDateOfOrdinalHoliday("2019-1-1", wrongDay);
		} catch (err) {
			assert.equal(
				err.message,
				"ordinalHolidayObj has a pair of properties{day,ordinal} which lead to a date that exceeds limit of date for the specific month"
			);
		}

		done();
	});
});

describe("isBankHoliday unit test", () => {
	it("right parameter get right result", (done) => {
		assert.equal(true, main.isBankHoliday("2010-12-31"));
		assert.equal(true, main.isBankHoliday("2017-12-30"));
		assert.equal(false, main.isBankHoliday("2017-12-1"));
		assert.equal(false, main.isBankHoliday("2019-1-14"));
		assert.equal(true, main.isBankHoliday("12/25/2018"));
		assert.equal(true, main.isBankHoliday("2017-8-26"));
		done();
	});
});

describe("getLastWorkingDate unit test", () => {
	it("right parameter get right result", (done) => {
		assert.equal(true, main.isBankHoliday("2017-1-2"));
		let lastWorkingDay = main.getLastWorkingDate("2017-1-2");
		assert.equal(2016, lastWorkingDay.getFullYear());
		assert.equal(11, lastWorkingDay.getMonth());
		assert.equal(30, lastWorkingDay.getDate());
		assert.equal(false, main.isBankHoliday(lastWorkingDay));
		done();
	});
});
