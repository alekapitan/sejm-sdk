import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["src/**/*.ts"],
  ignores: ["dist/**", "node_modules/**", "src/gen/openapi.ts"],
  // Note: Enable tseslint.configs.strictTypeChecked,
  extends: [eslint.configs.recommended, tseslint.configs.recommendedTypeChecked],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "ExportAllDeclaration",
        message: "Do not use `export *`.",
      },
    ],
    "no-restricted-exports": [
      "error",
      {
        restrictDefaultExports: {
          direct: true,
          named: true,
          defaultFrom: true,
          namedFrom: true,
          namespaceFrom: true,
        },
      },
    ],
  },
});
