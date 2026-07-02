import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import InputField from "../components/common/InputField";
import SuccessBanner from "../components/auth/SuccessBanner";

const LoginPage = () => {
  const location = useLocation();
  const successMessage = location.state?.successMessage || "";

  const [formData, setFormData] = useState({
    email: "test@example.com",
    password: "testpassword",
  });

  const [errors, setErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginSuccess("");
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoginSuccess("Logged in successfully! Welcome to the system.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            'Sign in to your account'
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            'Or'{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              'create a new account'
            </Link>
          </p>
        </div>

        <SuccessBanner message={successMessage || loginSuccess} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="test@example.com"
              required={true}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required={true}
            />
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 text-xs text-indigo-800 mb-4">
            <p className="font-semibold mb-1">'Test Account Credentials:'</p>
            <p>'Email: test@example.com'</p>
            <p>'Password: testpassword'</p>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              'Sign In'
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
