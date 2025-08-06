import React, { useState } from "react";
import InputField from "./InputField";
import "./LoginForm.css";
import {Visibility, VisibilityOff } from "@mui/icons-material"

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePasswordVisibility = () =>
    setShowPassword((prev) => !prev);

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <div className="input-group password-group">
        <label htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </span>
        </div>
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;