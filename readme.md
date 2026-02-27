# USA Bank Working Day

Toolkit for checking whether a given calendar date is a U.S. federal bank holiday (weekends included) and for computing related working-day helpers.

- Input date format: `"yyyy-mm-dd"` or `"yyyy-m-d"`
- Holiday source: https://www.federalreserve.gov/aboutthefed/k8.htm

## Install

```bash
# Bun (preferred)
bun add usa-bank-working-day

# npm
npm i usa-bank-working-day
```

## Usage

All APIs accept either a `Date` or a date string. When a method returns a date, it returns a `Date` object (constructed at local noon to avoid DST/midnight edge cases).

```ts
import toolkit, {
  UsaBankWorkingDayToolKit,
  createUsaBankWorkingDayToolKit,
} from "usa-bank-working-day";

const toYMD = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

toolkit.isBankHoliday("2020-7-3"); // true

toYMD(toolkit.getLastWorkingDate("2018-1-2")); // "2017-12-29"

toYMD(toolkit.fixedDateHolidayAdjust("2020-7-4")); // "2020-7-3" (observed)

// Prefer a fresh instance if you want isolated configuration/cache:
const isolated = createUsaBankWorkingDayToolKit();
const alsoIsolated = new UsaBankWorkingDayToolKit();
```

### CommonJS

```js
const toolkit = require("usa-bank-working-day");

toolkit.isBankHoliday("2022-01-17");

// Named exports are attached onto the default export for CJS:
const { UsaBankWorkingDayToolKit, createUsaBankWorkingDayToolKit } = toolkit;
```

## API Notes

- `isBankHoliday(date)` returns `true` for weekends (Sat/Sun) and observed federal holidays.
- `fixedDateHolidayAdjust(date)` applies observation rules: Sunday -> Monday, Saturday -> Friday.
- `getDateOfOrdinalHoliday(date, holiday)` / `getDateOfFixedDateHoliday(date, holiday)` use a "target year" from the first argument.
- Months are **0-indexed** (`0 = January`, `11 = December`).
- Historical applicability is modeled for holidays where it matters (e.g., Juneteenth is effective starting in 2021).
- Special case: `Dec 31` on a **Friday** is treated as a bank holiday (New Year's observed).

## Development

```bash
# Install deps
bun install

# Run all tests
bun test

# Coverage
bun test --coverage

# Run a single test by name
bun test -t "isBankHoliday"

# Run a single test file
bun test test/main.test.ts

# Build (tsup -> dist/cjs + dist/esm)
bun run build

# Package + compatibility gates (npm pack + publint + arethetypeswrong + runtime smokes)
bun run check:package
```

## Package / Exports Behavior

This package publishes both ESM and CJS via `exports`:

- `require("usa-bank-working-day")` resolves to `dist/cjs/index.cjs`
- `import ... from "usa-bank-working-day"` resolves to `dist/esm/index.mjs`

`dist/cjs/index.cjs` and `dist/esm/index.mjs` are small wrappers that:

- preserve the historical default export shape (the default singleton toolkit instance)
- expose modern named exports (`UsaBankWorkingDayToolKit`, `createUsaBankWorkingDayToolKit`) in both module systems

In CJS, those named exports are attached as properties on the default export; in ESM they are real named exports.

## Migration Notes (Jest/Rollup -> Bun/tsup)

- Tests: `yarn test` / `npx jest ...` -> `bun test` (and `bun test -t "name"`)
- Build: `yarn rollup` -> `bun run build` (tsup)
- Packaging verification: use `bun run check:package` (runs `npm pack`, `publint`, and `@arethetypeswrong/cli` plus runtime smokes)

## License

ISC
