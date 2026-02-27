module.exports = {
  root: true,
  extends: ["plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
    "jest/globals": true,
  },
  rules: {
    // Legacy codebase style: keep TS/Jest linting, relax purely stylistic rules.
    "prefer-const": "off",
    "prefer-rest-params": "off",
    "@typescript-eslint/adjacent-overload-signatures": "off",
  },
  overrides: [
    {
      files: ["test/**/*.ts"],
      rules: {
        "no-var": "off",
        "@typescript-eslint/no-loss-of-precision": "off",
      },
    },
  ],
};
