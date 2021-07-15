module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["airbnb-typescript", "airbnb-typescript-prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
  env: {
    es6: true,
  },
};
