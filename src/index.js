const { checkFixedDateHoliday, checkOrdinalHoliday, parseDate, setYMD } = require("./util");
let { ordinalHolidays: _ordinalHolidays, fixedDateHolidays: _fixedDateHolidays } = require("./presetConstant");

let holidayCache = {};

function getLastWorkingDate(targetYearDate) {
	let targetDate = setYMD(targetYearDate.getFullYear(), targetYearDate.getMonth(), targetYearDate.getDate() - 1);
	while (isBankHoliday(targetDate)) {
		targetDate = setYMD(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() - 1);
	}
	return targetDate;
}

function isBankHoliday(targetYearDate) {
	if (!holidayCache) {
		holidayCache = {};
	}
	if (!holidayCache[String(targetYearDate.getFullYear())]) {
		holidayCache[String(targetYearDate.getFullYear())] = [];
	}
	if (
		holidayCache[String(targetYearDate.getFullYear())].length <
		_ordinalHolidays.length + _fixedDateHolidays.length
	) {
		holidayCache[String(targetYearDate.getFullYear())] = _ordinalHolidays
			.map((oh) => getDateOfOrdinalHoliday(targetYearDate, oh))
			.concat(
				_fixedDateHolidays.map((fdh) => fixedDateHolidayAdjust(getDateOfFixedDateHoliday(targetYearDate, fdh)))
			);
	}

	let holidays = holidayCache[String(targetYearDate.getFullYear())];

	if (targetYearDate.getMonth() == 11 && targetYearDate.getDate() == 31 && targetYearDate.getDay() == 5) {
		return true;
	}
	if (
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

function fixedDateHolidayAdjust(targetYearDate) {
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

function getDateOfFixedDateHoliday(targetYearDate, fixedDateHolidayObj) {
	checkFixedDateHoliday(fixedDateHolidayObj);
	let year = targetYearDate.getFullYear(),
		month = fixedDateHolidayObj.month,
		date = fixedDateHolidayObj.date;
	return setYMD(year, month, date);
}

function getDateOfOrdinalHoliday(targetYearDate, ordinalHolidayObj) {
	checkOrdinalHoliday(ordinalHolidayObj);
	let year = targetYearDate.getFullYear(),
		{ month, ordinal, day } = ordinalHolidayObj,
		template = setYMD(year, month, 1),
		firstDateDay = template.getDay(),
		targetDate;
	if (ordinal < 0) {
		let lastDateOfMonth = setYMD(year, month + 1, 0),
			totalDateNumberInMonth = lastDateOfMonth.getDate(),
			fifthOrdinals = [],
			dayIndex = 0;
		while (dayIndex < totalDateNumberInMonth % 7) {
			fifthOrdinals.push((firstDateDay + dayIndex++) % 7);
		}
		ordinal += 5 + Math.ceil((fifthOrdinals.indexOf(day) + 1) / 7);
	}
	targetDate = (ordinal + Math.floor((firstDateDay - day - 1) / 7)) * 7 + day - firstDateDay + 1;
	template.setDate(targetDate);
	if (template.getMonth() != month) {
		throw Error(
			"ordinalHolidayObj has a pair of properties{day,ordinal} which lead to a date that exceeds limit of date for the specific month"
		);
	}
	return template;
}

function cleanCache() {
	holidayCache = {};
}

module.exports = {
	getLastWorkingDate: (targetYearDate) => {
		return getLastWorkingDate(parseDate(targetYearDate));
	},
	isBankHoliday: (targetYearDate) => {
		return isBankHoliday(parseDate(targetYearDate));
	},
	fixedDateHolidayAdjust: (targetYearDate) => {
		return fixedDateHolidayAdjust(parseDate(targetYearDate));
	},
	getDateOfFixedDateHoliday: (targetYearDate, fixedDateHolidayObj) => {
		return getDateOfFixedDateHoliday(parseDate(targetYearDate), fixedDateHolidayObj);
	},
	getDateOfOrdinalHoliday: (targetYearDate, ordinalHolidayObj) => {
		return getDateOfOrdinalHoliday(parseDate(targetYearDate), ordinalHolidayObj);
	},
	cleanCache,
	get ordinalHolidays() {
		return _ordinalHolidays;
	},
	get fixedDateHolidays() {
		return _fixedDateHolidays;
	},
	set ordinalHolidays(param) {
		Array.prototype.forEach.apply(param, [checkOrdinalHoliday]);
		_ordinalHolidays = param;
	},
	set fixedDateHolidays(param) {
		Array.prototype.forEach.apply(param, [checkFixedDateHoliday]);
		_fixedDateHolidays = param;
	}
};
