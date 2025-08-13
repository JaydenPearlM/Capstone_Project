import React, { useState } from "react";
import Input from "./Input";
import "./SignupForm.css";
import { Link } from "react-router-dom";

const SignupForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name required";
        if (!formData.email.trim()) newErrors.email = "Email required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalid";
        if (!formData.username.trim()) newErrors.username = "Username required";
        if (!formData.password) newErrors.password = "Password required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords must match";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
            />
            <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
            />
            <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
            />
            <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
            />
            <Input
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                isPassword={true} // <-- toggles visibility icon
                required
            />
            <Input
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                isPassword={true}
                required
            />

            <button type="submit" className="signup-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <div className="login-redirect">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </form>
    );
};

export default SignupForm;
