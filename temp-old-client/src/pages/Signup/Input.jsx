import React, { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./Input.css";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  isPassword = false, // whether to show eye icon toggle
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // For password fields, toggle between "text" and "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="input-wrapper" style={{ position: "relative" }}>
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          {...rest}
          style={{ paddingRight: isPassword ? "2.5rem" : undefined }}
        />
        {isPassword && (
          <span
            className="toggle-password"
            onClick={() => setShowPassword((show) => !show)}
            title={showPassword ? "Hide password" : "Show password"}
            aria-label="Toggle password visibility"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setShowPassword((show) => !show); }}
          >
            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        )}
      </div>
      {error && <small className="error">{error}</small>}
    </div>
  );
};

export default Input;
