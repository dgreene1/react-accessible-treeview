/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: "react-accessible-treeview",
  tagline:
    "A React component that implements the treeview pattern as described by the WAI-ARIA Authoring Practices.",
  url: "https://react-accessible-treeview.netlify.com",
  baseUrl: "/",
  favicon: "static/favicon.ico",
  organizationName: "lissitz", // Usually your GitHub org/user name.
  projectName: "react-accessible-treeview", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "react-accessible-treeview",
      links: [
        { to: "docs/api", label: "Docs", position: "left" },
        { to: "docs/examples-Basic", label: "Examples", position: "left" },
        {
          href: "https://github.com/lissitz/react-accessible-treeview",
          label: "GitHub",
          position: "right",
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
