import React, { useState } from "react";

export default function RegistrationForm({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    date_of_birth: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    insurance_provider: "",
    insurance_policy_number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onRegisterSuccess(formData);
      setSuccess("Patient registered successfully!");
      setFormData({
        name: "",
        date_of_birth: "",
        gender: "Male",
        phone: "",
        email: "",
        address: "",
        insurance_provider: "",
        insurance_policy_number: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to register patient. Please check the input fields.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        Register New Patient
      </h3>

      {error && (
        <div
          className="mb-4 p-3 bg-error-container text-error rounded-lg text-sm font-medium"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="name"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="date_of_birth"
            >
              Date of Birth *
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="gender"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="555-0199"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="address"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="123 Main St, City"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="insurance_provider"
            >
              Insurance Provider
            </label>
            <input
              type="text"
              id="insurance_provider"
              name="insurance_provider"
              value={formData.insurance_provider}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Blue Cross"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="insurance_policy_number"
            >
              Insurance Policy Number
            </label>
            <input
              type="text"
              id="insurance_policy_number"
              name="insurance_policy_number"
              value={formData.insurance_policy_number}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="POL123456"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </div>
      </form>
    </div>
  );
}
