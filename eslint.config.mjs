import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser, // Ensuring browser globals are available
    },
    ...pluginJs.configs.recommended, // Applying JavaScript recommended rules
    ...tseslint.configs.recommended, // Applying TypeScript recommended rules
  },
];
