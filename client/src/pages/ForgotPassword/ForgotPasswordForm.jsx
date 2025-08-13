import React, { useState } from "react";
import InputField from "./InputField"
import "./ForgotPasswordForm.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    // Simulate backend request
    setMessage(`If an account exists for ${email}, a reset link has been sent.`);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="forgot-form">
      {message && (
        <div className="info-message" style={{ color: "green", marginBottom: "1rem" }}>
          {message}
        </div>
      )}
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
