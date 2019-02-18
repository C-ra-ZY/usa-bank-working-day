# usabankholiday

this uitl is for checking whether some day was USA federal bank holiday.

calculate usa bank holidays according to https://www.federalreserve.gov/aboutthefed/k8.htm.

## Usage

```js
let usaWorkingDay = require("./index.js");
usaWorkingDay.getLastWorkingDate("dateString"); // date object
usaWorkingDay.isBankHoliday("dateString"); // boolean
usaWorkingDay.fixedDateHolidayAdjust("dateString"); // date object
usaWorkingDay.getDateOfFixedDateHoliday({
  month: number,
  day: number,
  ordinal: number,
  name: string(optional)
}); // date object
usaWorkingDay.getDateOfOrdinalHoliday({
  month: number,
  date: number,
  name: string(optional)
}); // date object
```

## License

ISC
