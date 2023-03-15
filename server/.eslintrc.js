module.exports = {
  env: {
    es6: true,
    es2020: true,
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/naming-convention": [
      "warn",
      {selector: "default", format: ["camelCase"]},
      {selector: "variableLike", format: ["camelCase"]},
      {selector: "variable", format: ["camelCase"]},
      {selector: "parameter", format: ["camelCase"]},
      {selector: "memberLike", format: ["camelCase"]},
      {selector: "typeLike", format: ["PascalCase"]},
      {selector: "typeParameter", format: ["PascalCase"]},
      {selector: "enumMember", format: ["PascalCase"]},
    ],
    "eol-last": ["error", "always"],
    "eqeqeq": ["error", "always"],
    "jsx-quotes": ["error", "prefer-double"],
    "max-len": [
      "error", {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    "no-multi-spaces": "error",
    "no-return-assign": "warn",
    "semi": [2, "always"],
    "quotes": ["error", "double"],
  },
};
