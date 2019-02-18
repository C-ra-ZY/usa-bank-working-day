# usabankholiday

this util is for checking whether a day is USA federal bank holiday.

calculating usa bank holidays according to https://www.federalreserve.gov/aboutthefed/k8.htm.

## Usage

```js
let usaBankHoliday = require("./index.js");

usaBankHoliday.getLastWorkingDate("2018-1-2"); // 2017-12-29

usaBankHoliday.isBankHoliday("2020-7-3"); // true

usaBankHoliday.fixedDateHolidayAdjust("2020-7-4"); // 2020-7-3

usaBankHoliday.getDateOfOrdinalHoliday("2019-1-11",{
    month: 10,
    day: 4,
    ordinal: 4, //last
    name: "Thanksgiving Day"
  }); // 2019-11-28

usaBankHoliday.getDateOfFixedDateHoliday("2020-1-1",{
    month:6,
    date:4,
    name: "Independence Day"
  }); // 2020-07-04
  
usaBankHoliday.fixedDateHolidayAdjust(
  usaBankHoliday.getDateOfFixedDateHoliday("2020-1-1",{
    month:6,
    date:4,
    name: "Independence Day"
  })
); // 2020-07-03
```

## License

ISC
