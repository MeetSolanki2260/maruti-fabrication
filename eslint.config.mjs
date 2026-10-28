import vitals from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";
const config = [...vitals, ...ts,
  { ignores: [".next/**", "out/**", "node_modules/**", "drizzle/**"] },
  { rules: { "react/no-danger": "error", "no-eval": "error", "no-implied-eval": "error" } }];
export default config;
