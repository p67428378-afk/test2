import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "../components/common/InputField";
import PasswordStrengthBar from "../components/auth/PasswordStrengthBar";
import { registerUser } from "../services/api";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    if (name === "first_name" && !value.trim()) {
      error = "First name is required.";
    } else if (name === "last_name" && !value.trim()) {
      error = "Last name is required.";
    } else if (name === "email") {
      if (!value.trim()) {
        error = "Email is required.";
      } else if (
        !/\S+@\s+\.\s+/.test(value) &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        error = "Please enter a valid email address.";
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters.";
      }
    } else if (name === "confirm_password") {
      if (!value) {
        error = "Please confirm your password.";
      } else if (value !== formData.password) {
        error = "Passwords do not match.";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // If password changes, re-validate confirm password
    if (name === "password" && formData.confirm_password) {
      const confirmError =
        value !== formData.confirm_password ? "Passwords do not match." : "";
      setErrors((prev) => ({ ...prev, confirm_password: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      };
      const result = await registerUser(payload);
      // Redirect to login page with success message
      navigate("/login", {
        state: {
          successMessage:
            result.message || "Account created successfully! Please log in.",
        },
      });
    } catch (err) {
      setApiError(
        err.detail || err.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            'Create your account'
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            'Or'{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              'sign in to your existing account'
            </Link>
          </p>
        </div>

        {apiError && (
          <div
            className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm"
            role="alert"
          >
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              label="First Name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.first_name}
              placeholder="John"
              required={true}
            />
            <InputField
              label="Last Name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.last_name}
              placeholder="Doe"
              required={true}
            />
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              placeholder="john.doe@example.com"
              required={true}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              placeholder="••••••••"
              required={true}
            />
            <PasswordStrengthBar password={formData.password} />
            <InputField
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirm_password}
              placeholder="••••••••"
              required={true}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
