module.exports = {
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "jest", "react"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    "jest/globals": true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
