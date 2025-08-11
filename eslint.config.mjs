import {dirname} from "path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from '@next/eslint-plugin-next'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const config = [
   ...compat.extends("next/core-web-vitals", "next/typescript"),
  stylistic.configs.recommended,
  {
    rules: {
    },
  },
]

export default config
