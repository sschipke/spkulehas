import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";

const browserGlobals = {
  process: "readonly",
  console: "readonly",
  window: "readonly",
  document: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  fetch: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  localStorage: "readonly",
  FormData: "readonly",
  module: "readonly",
  require: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  exports: "writable",
  React: "readonly",
};

export default [
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "react/prop-types": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "rendered.html"],
  },
];
