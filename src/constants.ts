export type HolidayNames =
  | "Birthday of Martin Luther King, Jr"
  | "Washington's Birthday"
  | "Memorial Day"
  | "Juneteenth National Independence Day"
  | "Labor Day"
  | "Columbus Day"
  | "Thanksgiving Day"
  | "New Year's Day"
  | "Independence Day"
  | "Veterans Day"
  | "Christmas Day";

export interface Holiday {
  month: number;
  day: number;
  ordinal: number;
  name: HolidayNames;
}

export interface OrdinalHoliday extends Holiday {
  ordinal: number;
}

export interface FixedDateHoliday extends Pick<Holiday, "month" | "name"> {
  date: number;
}
const presetHolidays: {
  ordinalHolidays: OrdinalHoliday[];
  fixedDateHolidays: FixedDateHoliday[];
} = {
  ordinalHolidays: [
    {
      month: 0,
      day: 1,
      ordinal: 3,
      name: "Birthday of Martin Luther King, Jr",
    },
    {
      month: 1,
      day: 1,
      ordinal: 3,
      name: "Washington's Birthday",
    },
    {
      month: 4,
      day: 1,
      ordinal: -1, //last
      name: "Memorial Day",
    },
    {
      month: 8,
      day: 1,
      ordinal: 1,
      name: "Labor Day",
    },
    {
      month: 9,
      day: 1,
      ordinal: 2,
      name: "Columbus Day",
    },
    {
      month: 10,
      day: 4,
      ordinal: 4,
      name: "Thanksgiving Day",
    },
  ],
  fixedDateHolidays: [
    {
      month: 0,
      date: 1,
      name: "New Year's Day",
    },
    {
      month: 5,
      date: 19,
      name: "Juneteenth National Independence Day",
    },
    {
      month: 6,
      date: 4,
      name: "Independence Day",
    },
    {
      month: 10,
      date: 11,
      name: "Veterans Day",
    },
    {
      month: 11,
      date: 25,
      name: "Christmas Day",
    },
  ],
};

export default presetHolidays;
