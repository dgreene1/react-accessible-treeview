/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import classnames from "classnames";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import CheckboxTree from "../../docs/examples/MultiSelectCheckbox";
import DirectoryTree from "../../docs/examples/DirectoryTree";

const features = [
  {
    title: <>Features</>,
    component: <DirectoryTree />,
    description: (
      <>
        <ul>
          <li>Single and multiple selection</li>
          <li>Disabled nodes</li>
          <li>Extensive key bindings</li>
        </ul>
      </>
    ),
  },
  {
    title: <>Flexible</>,
    component: <CheckboxTree />,
    description: (
      <>
        Highly customizable through the use of the render prop and prop getter
        patterns.
      </>
    ),
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const baseUrl = useBaseUrl("docs/api");
  return (
    <Layout
      title={`react-accessible-treeview`}
      description="A React component react component that implements the treeview pattern as described by the WAI-ARIA Authoring Practices."
    >
      <header className={classnames("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={baseUrl}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row" style={{ flexWrap: "nowrap" }}>
                {features.map(({ component, title, description }, idx) => (
                  <div
                    key={idx}
                    className={classnames("col col--6", styles.feature)}
                  >
                    <h3>{title}</h3>
                    <div> {description}</div>
                    {component && <div>{component}</div>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
