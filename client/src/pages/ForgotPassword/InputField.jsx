import React from "react";

const InputField = ({ label, type, name, value, onChange }) => (
  <div className="input-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default InputField;