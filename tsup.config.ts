import { defineConfig } from "tsup";

const shared = {
  entry: ["src/index.ts", "src/utils.ts", "src/constants.ts", "src/rules.ts"],
  sourcemap: true,
  clean: true,
  target: "es5",
  platform: "node" as const,
  tsconfig: "./tsconfig.json",
  bundle: false,
  splitting: false,
  minify: true,
  skipNodeModulesBundle: true,
  outExtension: () => ({ js: ".js" }),
};

export default defineConfig([
  {
    ...shared,
    format: ["cjs"],
    outDir: "dist/cjs",
    cjsInterop: true,
    dts: true,
  },
  {
    ...shared,
    format: ["esm"],
    outDir: "dist/esm",
    dts: true,
  },
]);
