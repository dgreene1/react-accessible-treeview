import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  {
    input: "src/index.js",
    external: ["react", "classnames", "prop-types"],
    output: {
      name: "react-accessible-treeview",
      file: pkg.browser,
      format: "umd",
      globals: { react: "React", classnames: "cx", "prop-types": "PropTypes" }
    },
    plugins: [
      babel({
        exclude: ["node_modules/**"]
      }),
      commonjs(),
      terser()
    ]
  },
  {
    input: "src/index.js",
    external: ["react", "classnames", "prop-types"],
    output: [
      {
        file: pkg.main,
        format: "cjs",

        globals: { react: "React", classnames: "cx", "prop-types": "PropTypes" }
      },
      {
        file: pkg.module,
        format: "es",

        globals: { react: "React", classnames: "cx" }
      }
    ],
    plugins: [
      resolve(),
      babel({
        exclude: ["node_modules/**"]
      }),
      commonjs(),
      terser()
    ]
  }
];
