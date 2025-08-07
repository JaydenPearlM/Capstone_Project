import { useState } from "react";
import "./ChangePasswordForm.css";

const ChangePasswordForm = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to backend
    alert("Settings saved!");
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h2>Change Password</h2>

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter new password"
        />
      </label>

      <label>
        Confirm Password:
        <input
          type="password"
          name="password"
          value={form.ConfirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
        />
      </label>

      <button type="submit">Update Password</button>
    </form>
  );
};

export default ChangePasswordForm;