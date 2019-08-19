import React from "react";
import path from "path";
import { configure } from "@storybook/react";
import { getStorybook, storiesOf } from "@storybook/react";

let getPackageName = filePath =>
  path
    .dirname(filePath)
    .split(path.sep)
    .reverse()[1];

configure(() => {
  const req = require.context("../website/docs/examples", true, /.js$/);

  req.keys().forEach(pathToExample => {
    const Component = req(pathToExample).default;
    console.log(Component.name)
    storiesOf("TreeView", module).add(Component.name, () => <Component />);
  });
}, module);

export { getStorybook };
