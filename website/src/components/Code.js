import React from "react";
import components from "@theme/MDXComponents";

const Code = ({ className, children }) => (
  <components.pre>
    <components.code className={className}>{children}</components.code>
  </components.pre>
);

export default Code;
