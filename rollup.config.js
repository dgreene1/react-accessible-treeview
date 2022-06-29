import { DEFAULT_EXTENSIONS } from "@babel/core";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
  {
    input: "src/index.ts",
    external: ["react", "classnames", "prop-types"],
    output: {
      name: "react-accessible-treeview",
      file: pkg.browser,
      format: "umd",
      globals: { react: "React", classnames: "cx", "prop-types": "PropTypes" },
      exports: "named",
    },
    plugins: [
      typescript(),
      babel({
        extensions: [...DEFAULT_EXTENSIONS, "ts", "tsx"],
        exclude: ["node_modules/**"],
      }),
      commonjs(),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    external: ["react", "classnames", "prop-types"],
    output: [
      {
        file: pkg.main,
        format: "cjs",
        globals: {
          react: "React",
          classnames: "cx",
          "prop-types": "PropTypes",
        },
        exports: "named",
      },
      {
        file: pkg.module,
        format: "es",
        globals: { react: "React", classnames: "cx" },
        exports: "named",
      },
    ],
    plugins: [
      typescript(),
      resolve(),
      babel({
        extensions: [...DEFAULT_EXTENSIONS, "ts", "tsx"],
        exclude: ["node_modules/**"],
      }),
      commonjs(),
      terser(),
    ],
  },
];
