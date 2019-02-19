const { dateExists } = require("date-exists");
function setYMD(year, month, date) {
	if (!Number.isSafeInteger(year)) {
		throw Error("this function requires a safe integer of year");
	}
	if (!Number.isSafeInteger(month) || month > 11 || month < 0) {
		throw Error("this function requires a safe integer of month, and the number shall be in [0,11]");
	}
	if (!Number.isSafeInteger(date) || date > 31 || date < 0) {
		throw Error("this function requires a safe integer of date, and the number shall be in [0,31]");
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

function parseDate(targetDate) {
	let parsedDate = {
		toJSON: () => false
	};
	targetDate = "toDate" in Object(targetDate) ? targetDate.toDate() : targetDate;
	if (!Number(targetDate)) {
		targetDate = String(targetDate);
		if (
			[
				/^(\d{1,2})[\/\s\-](\d{1,2})[\/\s\-](\d{2,4})Z?$/i,
				/^(\d{4})[\/\s\-](\d{1,2})[\/\s\-](\d{1,2})Z?$/i
			].some((e) => e.test(targetDate))
		) {
			let tempDate = new Date(targetDate + (/Z$/i.test(targetDate) ? "" : "Z"));
			parsedDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate());
		}
	} else if (typeof targetDate == "number") {
		parsedDate = new Date(targetDate);
	} else if (targetDate instanceof Date) {
		parsedDate = targetDate;
	}
	if (!parsedDate.toJSON()) {
		throw Error(
			"this function requires one argument typeof Date, or formated date string like 'yyyy-MM-dd' or milliseconds(long) from 1970/1/1 00:00:00 (UTC)"
		);
	}
	return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
}

function checkFixedDateHoliday(fixedDateHolidayObj) {
	let { month, date } = fixedDateHolidayObj;
	if (!Number.isSafeInteger(month) || month > 11 || month < 0) {
		throw Error("this function requires a safe integer of month, and the number shall be in [0,11]");
	}
	if (!Number.isSafeInteger(date) || date > 31 || date < 0) {
		throw Error("this function requires a safe integer of date, and the number shall be in [0,31]");
	}
}

function checkOrdinalHoliday(ordinalHolidayObj) {
	let { ordinal, month, day } = ordinalHolidayObj;
	if (!Number.isSafeInteger(month) || month > 11 || month < 0) {
		throw Error("this function requires a safe integer of month, and the number shall be in [0,11]");
	}
	if (!Number.isSafeInteger(ordinal) || ordinal > 5 || ordinal < -5 || ordinal === 0) {
		throw Error("this function requires a safe integer of ordinal, and the number shall be in [-5,0),(0,5]");
	}
	if (!Number.isSafeInteger(day) || day > 6 || day < 0) {
		throw Error("this function requires a safe integer of day, and the number shall be in [0,6]");
	}
}

module.exports = {
	checkFixedDateHoliday,
	checkOrdinalHoliday,
	parseDate,
	setYMD
};
