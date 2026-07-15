import React, { useState, useEffect } from "react";

export default function RegistrationForm({ onRegisterSuccess, onToggleLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [govId, setGovId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Load draft registration if exists
  useEffect(() => {
    const draft = localStorage.getItem("registration_draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFullName(parsed.fullName || "");
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
        setGovId(parsed.govId || "");
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  // Save draft on input change
  const saveDraft = (updatedFields) => {
    const currentDraft = {
      fullName,
      email,
      phone,
      govId,
      ...updatedFields,
    };
    localStorage.setItem("registration_draft", JSON.stringify(currentDraft));
  };

  const handleVerifyID = () => {
    if (!govId || !fullName) {
      setError("Please enter your Full Name and Government ID first.");
      return;
    }
    setError("");
    setIsVerifying(true);
    // Simulate third-party online ID verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setSuccess("Online ID Verification: Successful & Verified!");
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !govId || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isVerified) {
      setError("Please complete the Online ID Verification first.");
      return;
    }

    try {
      onRegisterSuccess({
        email,
        password,
        full_name: fullName,
        phone: phone || null,
        gov_id: govId,
      });
      // Clear draft on successful registration
      localStorage.removeItem("registration_draft");
      setSuccess("Registration successful! You can now log in.");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-surface-variant flex flex-col h-full shadow-lg">
      <header className="mb-6 border-b border-surface-variant pb-4">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Visitor Registration
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Create your secure account to schedule visits.
        </p>
      </header>

      {error && (
        <div className="mb-4 p-3 bg-error-container border border-error text-on-error-container rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-[#132d20] border border-[#1f4a35] text-[#4ade80] rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="fullName"
          >
            Full Name *
          </label>
          <input
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-transparent"
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              saveDraft({ fullName: e.target.value });
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="email"
          >
            Email *
          </label>
          <input
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-transparent"
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              saveDraft({ email: e.target.value });
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-transparent"
            id="phone"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              saveDraft({ phone: e.target.value });
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="govId"
          >
            Government ID *
          </label>
          <input
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-transparent"
            id="govId"
            type="text"
            placeholder="DL-987654321"
            value={govId}
            onChange={(e) => {
              setGovId(e.target.value);
              saveDraft({ govId: e.target.value });
            }}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="font-label-sm text-label-sm text-on-surface-variant"
            htmlFor="password"
          >
            Password *
          </label>
          <input
            className="bg-surface-container-high border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed focus:border-transparent"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={handleVerifyID}
            disabled={isVerifying || isVerified}
            className={`w-full py-2 px-4 rounded-lg font-label-md text-label-md transition-colors flex items-center justify-center gap-2 ${
              isVerified
                ? "bg-[#132d20] border border-[#1f4a35] text-[#4ade80]"
                : "bg-secondary-container text-on-secondary-container hover:bg-opacity-90"
            }`}
          >
            {isVerifying ? (
              <span>Verifying ID...</span>
            ) : isVerified ? (
              <>
                <span className="font-bold">✓</span>
                <span>Online ID Verified</span>
              </>
            ) : (
              <span>Verify ID Online</span>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={!isVerified}
          className={`mt-4 w-full font-label-md text-label-md py-3 rounded-lg transition-opacity ${
            isVerified
              ? "bg-[#6366f1] text-white hover:bg-opacity-90"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Register Account
        </button>

        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={onToggleLogin}
            className="font-body-sm text-body-sm text-primary hover:underline bg-transparent border-none cursor-pointer"
          >
            Already have an account? Log in
          </button>
        </div>
      </form>
    </div>
  );
}
