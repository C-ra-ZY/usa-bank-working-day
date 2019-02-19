const chai = require('chai'), expect = chai.expect, assert = chai.assert, should = chai.should();
const utils = require("../src/util");

describe("checkFixedDateHoliday unit test", () => {
    it("with wrong paramter", (done) => {
        try {
            utils.checkFixedDateHoliday({ month: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }

        try {
            utils.checkFixedDateHoliday({ date: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkFixedDateHoliday({});
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkFixedDateHoliday({ month: -1, date: 27 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkFixedDateHoliday({ month: 12, date: 27 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkFixedDateHoliday({ month: 10, date: -1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }

        try {
            utils.checkFixedDateHoliday({ month: 10, date: 32 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }

        done();
    });

});
describe("parseDate unit test", () => {
    it("parseDate with wrong paramter", (done) => {
        let parsedDate
        try {
            parsedDate = utils.parseDate(undefined);
        } catch (err) {
            assert.equal(err.message, "this function requires one argument typeof Date, or formated date string like 'yyyy-MM-dd' or milliseconds(long) from 1970/1/1 00:00:00 (UTC)");
        }
        done();
    });
    it("parseDate with right paramter", (done) => {
        var parsedDate = utils.parseDate("2017-11-27");
        assert.equal(parsedDate.getDate(), "27");
        assert.equal(parsedDate.getFullYear(), "2017");
        assert.equal(parsedDate.getMonth(), "10");

        parsedDate = utils.parseDate("2017-11-27Z");
        assert.equal(parsedDate.getDate(), "27");
        assert.equal(parsedDate.getFullYear(), "2017");
        assert.equal(parsedDate.getMonth(), "10");

        parsedDate = utils.parseDate(new Date);
        assert.equal(parsedDate.getDate(), (new Date).getDate());
        assert.equal(parsedDate.getFullYear(), (new Date).getFullYear());
        assert.equal(parsedDate.getMonth(), (new Date).getMonth());

        parsedDate = utils.parseDate(new Date(2017, 10, 27, 0));
        assert.equal(parsedDate.getDate(), "27");
        assert.equal(parsedDate.getFullYear(), "2017");
        assert.equal(parsedDate.getMonth(), "10");

        parsedDate = utils.parseDate(1511740800000);
        assert.equal(parsedDate.getDate(), (new Date(1511740800000)).getDate());
        assert.equal(parsedDate.getFullYear(), (new Date(1511740800000)).getFullYear());
        assert.equal(parsedDate.getMonth(), (new Date(1511740800000)).getMonth());

        done();
    });
});

describe("checkOrdinalHoliday unit tett", () => {
    it("with wrong paramter", (done) => {
        try {
            utils.checkOrdinalHoliday({ month: 1, day: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of ordinal, and the number shall be in [-5,0),(0,5]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 1, ordinal: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of day, and the number shall be in [0,6]");
        }

        try {
            utils.checkOrdinalHoliday({ day: 1, ordinal: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkOrdinalHoliday({});
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkOrdinalHoliday({ month: -1, day: 2, ordinal: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 12, day: 2, ordinal: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 1, day: -1, ordinal: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of day, and the number shall be in [0,6]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 1, day: 7, ordinal: 1 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of day, and the number shall be in [0,6]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 1, day: 1, ordinal: 0 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of ordinal, and the number shall be in [-5,0),(0,5]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 1, day: 1, ordinal: 6 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of ordinal, and the number shall be in [-5,0),(0,5]");
        }

        try {
            utils.checkOrdinalHoliday({ month: 1, day: 1, ordinal: -6 });
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of ordinal, and the number shall be in [-5,0),(0,5]");
        }
        done();
    });

});

describe("arraylize unit test", () => {
    if ("parameter not array", done => {
        var result = utils.arraylize({});
        assert.equal(result.length, 1);
        result = utils.arraylize({ length: 2 });
        assert.equal(result.length, 2);
    });

    if ("parameter is array", done => {
        var result = utils.arraylize([]);
        assert.equal(result.length, 1);
    });
});

describe("setYMD unit test", () => {
    it("wrong parameter", done => {
        try {
            utils.setYMD(2.7976931348623157e+308, 1, 1);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of year");
        }

        try {
            utils.setYMD(2017, 2.7976931348623157e+308, 1);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.setYMD(2017, -1, 1);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.setYMD(2017, 12, 1);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of month, and the number shall be in [0,11]");
        }

        try {
            utils.setYMD(2017, 11, -1);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }

        try {
            utils.setYMD(2017, 11, 32);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }

        try {
            utils.setYMD(2017, 11, 2.7976931348623157e+308);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }

        try {
            utils.setYMD(2017, 2, 29);
        } catch (err) {
            assert.equal(err.message, "this function requires a safe integer of date, and the number shall be in [0,31]");
        }
        done();
    });
});    
