# USA Bank Working Day

this toolkit is to help developers checking if a date string("yyyy-mm-dd" or "yyyy-m-d") is USA federal bank holiday.

calculating usa bank holidays according to https://www.federalreserve.gov/aboutthefed/k8.htm.

## Usage

```typescript
import usaBankWorkingDay from "usa-bank-working-day";

usaBankWorkingDay.getLastWorkingDate("2018-1-2"); // 2017-12-29

usaBankWorkingDay.isBankHoliday("2020-7-3"); // true

usaBankWorkingDay.fixedDateHolidayAdjust("2020-7-4"); // 2020-7-3

/* 
  first parameter is to locate the year
*/
usaBankWorkingDay.getDateOfOrdinalHoliday("2019-1-11", {
  month: 10,
  day: 4,
  ordinal: 4,
  name: "Thanksgiving Day",
}); // 2019-11-28

/* 
  first parameter is to locate the year
*/
usaBankWorkingDay.getDateOfFixedDateHoliday("2020-1-1", {
  month: 6,
  date: 4,
  name: "Independence Day",
});

/* 
  first parameter is to locate the year
*/
usaBankWorkingDay.fixedDateHolidayAdjust(
  usaBankWorkingDay.getDateOfFixedDateHoliday("2020-1-1", {
    month: 6,
    date: 4,
    name: "Independence Day",
  })
);
```

## License

ISC
