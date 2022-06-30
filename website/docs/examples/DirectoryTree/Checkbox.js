import React, { useState } from "react";

const Checkbox = ({ defaultState = false, onChange, children }) => {
  const [on, setOn] = useState(defaultState);
  const handleChange = (e) => {
    setOn(e.target.checked);
    onChange && onChange(e.target.checked);
  };
  return (
    <form style={{ display: "inline-block", padding: 10 }}>
      <label>
        <input type="checkbox" checked={on} onChange={handleChange} />
        {children}
      </label>
    </form>
  );
};

export default Checkbox;
