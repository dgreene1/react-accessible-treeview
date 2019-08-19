import React from "react";
import Code from "../Code";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import Tooltip from "../Tooltip";
import "@reach/tabs/styles.css";
import "@reach/tooltip/styles.css";

import { MdBrush, MdCode, MdWebAsset } from "react-icons/md";
import "./styles.css";

const CodeTabs = ({ component: Component, js, css }) => (
  <Tabs className="code-tabs">
    <TabList>
      <Tab>
        <Tooltip label="Live Example">
          <div>
            <MdWebAsset />
          </div>
        </Tooltip>
      </Tab>
      <Tab>
        <Tooltip label="Code">
          <div>
            <MdCode />
          </div>
        </Tooltip>
      </Tab>
      <Tab>
        <Tooltip label="Styling">
          <div>
            <MdBrush />
          </div>
        </Tooltip>
      </Tab>
    </TabList>
    <TabPanels>
      <TabPanel className="code-tabs-tabpanel__component">
        <Component />
      </TabPanel>
      <TabPanel>
        <Code className="language-js">{js}</Code>
      </TabPanel>
      <TabPanel>
        <Code className="language-css">{css}</Code>
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default CodeTabs;
