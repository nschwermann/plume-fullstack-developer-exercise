import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Logical issues detection
      "no-constant-condition": "error",
      "no-dupe-else-if": "error", 
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-constant-binary-expression": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-private-class-members": "error",
      "no-useless-assignment": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "warn",
      "array-callback-return": "error",
      "no-constructor-return": "error",
      "no-promise-executor-return": "error",
      "no-unreachable-loop": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "prefer-const": "error",
      "no-var": "error",
      
      // TypeScript specific logical checks
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
    }
  }
];

export default eslintConfig;
