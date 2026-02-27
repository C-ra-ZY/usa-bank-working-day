# AGENTS.md — usa-bank-working-day

> TypeScript library for determining USA federal bank holidays and working days.
> Zero runtime dependencies aside from `date-exists`. Published as both CJS and ESM.

## Build & Run Commands

```bash
# Install dependencies (Bun-first)
bun install

# Run all tests
bun test

# Run a single test file
bun test test/main.test.ts

# Run a single test by name (substring match)
bun test -t "isBankHoliday"

# Coverage
bun test --coverage

# Timezone-specific tests (UTC + Eastern)
bun run test:tz

# Build with tsup (dual CJS + ESM output)
bun run build

# Type-check only (no emit)
bunx tsc --noEmit

# Full package compatibility check (smoke tests + pack + publint + arethetypeswrong)
bun run check:package
```

## Project Structure

```
src/
  index.ts          # Main class: UsaBankWorkingDayToolKit + factory + default singleton
  constants.ts      # Holiday definitions: OrdinalHoliday[], FixedDateHoliday[]
  rules.ts          # Pure business logic: holiday adjustment, ordinal calc, weekend/NYE checks
  utils.ts          # Helpers: setYMD(), parseDate(), toYmd(), fromYmd(), addDaysYmd(), Ymd type

test/
  main.test.ts              # Integration tests for the toolkit class
  util.spec.ts              # Unit tests for utility functions
  fixtures/
    us-bank-holidays.ts     # Full-year calendars + observed holiday sets for 2022/2026/2027/2028

dist/
  cjs/              # CJS build + wrapper entrypoint (index.cjs)
  esm/              # ESM build + wrapper entrypoint (index.mjs)
```

## TypeScript Configuration

- **Target**: ES5 (tsconfig + tsup)
- **Module**: ESNext (tsup emits both CJS and ESM)
- **Strict mode**: enabled
- Key flags: `esModuleInterop`, `allowSyntheticDefaultImports`, `experimentalDecorators`,
  `forceConsistentCasingInFileNames`, `noFallthroughCasesInSwitch`, `isolatedModules`
- Source maps enabled

## Code Style & Conventions

### Formatting

- **Indentation**: 2 spaces
- **Quotes**: double quotes for strings
- **Semicolons**: required
- **Trailing commas**: used in multi-line arrays/objects
- **Brace style**: opening brace on same line (K&R)

### Naming

- **Classes**: PascalCase (`UsaBankWorkingDayToolKit`)
- **Interfaces/Types**: PascalCase (`OrdinalHoliday`, `FixedDateHoliday`, `Ymd`)
- **Functions**: camelCase (`setYMD`, `parseDate`, `isBankHoliday`)
- **Variables**: camelCase (`targetDate`, `holidayCache`)
- **Private fields**: descriptive name, no underscore (`customizedOrdinalHolidays`)
- **Private preset copies**: underscore prefix on destructured consts (`_ordinalHolidays`)
- **Constants**: camelCase for objects (`presetHolidays`), PascalCase for regex (`DateRegExp`)

### Imports

- Named imports preferred: `import { parseDate, setYMD } from "./utils"`
- Default imports for modules exporting defaults: `import presetHolidays from "./constants"`
- Combined default + named: `import presetHolidays, { FixedDateHoliday } from "./constants"`
- Relative paths with `./` prefix, no file extensions
- No barrel files — import directly from source files

### Types

- Use TypeScript interfaces for data shapes (`interface Ymd`, `interface OrdinalHoliday`)
- Use `extends` and `Pick<>` for interface composition
- String literal union types for enums (`type HolidayNames = "..." | "..."`)
- Central value type `Ymd { year, month, day }` used throughout for date arithmetic
- **Method overloads** for dual `Date | string` acceptance (NOT decorators):
  ```ts
  isBankHoliday(targetYearDate: Date): boolean;
  isBankHoliday(targetYearDate: string): boolean;
  isBankHoliday(targetYearDate: Date | string): boolean { ... }
  ```
- Avoid `as any` — only tolerated in test catch blocks

### Error Handling

- Throw `Error()` with descriptive messages — not custom error classes
- Validation at function boundaries (check inputs immediately, throw if invalid)
- Input validation: `Number.isSafeInteger()`, range checks, regex tests
- Date validation uses external `dateExists()` from `date-exists` package

### Export Pattern

- Root default export is a **singleton instance** (`export default createUsaBankWorkingDayToolKit()`)
- Named exports: `UsaBankWorkingDayToolKit` and `createUsaBankWorkingDayToolKit`
- Package entrypoints use small wrappers for CJS/ESM compatibility:
  - CJS: `dist/cjs/index.cjs` — CommonJS wrapper
  - ESM: `dist/esm/index.mjs` — ESM re-export wrapper

### ESLint

- Parser: `@typescript-eslint/parser`, plugins: `@typescript-eslint`, `jest`
- Relaxed rules: `prefer-const: off`, `prefer-rest-params: off`,
  `@typescript-eslint/adjacent-overload-signatures: off`
- Test overrides: `no-var: off`, `@typescript-eslint/no-loss-of-precision: off`

## Testing Conventions

- **Framework**: Bun test runner (`bun test`)
- **File naming**: `*.test.ts` or `*.spec.ts` in `test/` directory
- **Structure**: `describe()` blocks grouped by method/feature, `it()` for cases
- **Assertions**: Bun/Jest-compatible `expect()` matchers
- **Setup**: `beforeEach()` to reset singleton state (re-assign holidays + `cleanCache()`)
- **Date strings**: use `"yyyy-mm-dd"` or `"yyyy-m-d"` format
- **Full-year calendar tests**: iterate every day in a year against known holiday sets

## Key Domain Concepts

- **Months are 0-indexed** (January = 0, December = 11) — matches JS `Date.getMonth()`
- **OrdinalHoliday**: holiday on Nth weekday of a month (e.g., 3rd Monday of January)
  - `ordinal: -1` means "last" occurrence of that weekday
- **FixedDateHoliday**: holiday on a fixed calendar date (e.g., July 4th)
  - If falls on Sunday → observed Monday; if Saturday → observed Friday
- **Bank holiday includes**: federal holidays + weekends (Saturday/Sunday)
- **Special case**: Dec 31 on a Friday is treated as a bank holiday (New Year's observed)
- **Effective years**: `effectiveFromYear` / `effectiveToYear` on holidays (e.g., Juneteenth from 2021)
- **Ymd type**: `{ year, month, day }` — all pure date arithmetic uses this, not `Date` objects

## Dependencies

- **Runtime**: `date-exists` (date validation)
- **Dev**: TypeScript 4.x, Bun test, tsup, ESLint, cross-env, @swc/core

## Common Pitfalls

1. Default export is a **singleton** — `cleanCache()` and holiday setters affect all consumers
2. Methods accept both `string` and `Date` via overloads; the implementation signature is the union type
3. Months are 0-indexed in holiday definitions (January = 0)
4. `rules.ts` functions operate on `Ymd`, not `Date` — convert with `toYmd()` / `fromYmd()`
5. `addDaysYmd` and `weekdayFromYmd` use UTC internally to avoid timezone issues
