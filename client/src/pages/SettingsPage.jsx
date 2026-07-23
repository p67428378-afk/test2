import React, { useState } from "react";
import { passwordResetService } from "../services/api.js";

export default function SettingsPage() {
  const [step, setStep] = useState(1); // 1: Initiate, 2: OTP, 3: Security Question, 4: New Password, 5: Success
  const [loginId, setLoginId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityQuestionSessionId, setSecurityQuestionSessionId] =
    useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [passwordResetSessionId, setPasswordResetSessionId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInitiate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await passwordResetService.initiate(loginId, mobileNumber);
      setOtpSessionId(data.otp_session_id);
      setSecurityQuestion(data.security_question);
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to initiate password reset.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await passwordResetService.verifyOtp(otpCode, otpSessionId);
      setSecurityQuestionSessionId(data.security_question_session_id);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurityQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await passwordResetService.verifySecurityQuestion(
        securityAnswer,
        securityQuestionSessionId,
      );
      setPasswordResetSessionId(data.password_reset_session_id);
      setStep(4);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Incorrect answer to security question.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await passwordResetService.setNewPassword(
        newPassword,
        passwordResetSessionId,
      );
      setSuccessMessage(data.status || "Password reset successfully!");
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to set new password.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setLoginId("");
    setMobileNumber("");
    setOtpCode("");
    setOtpSessionId("");
    setSecurityQuestion("");
    setSecurityQuestionSessionId("");
    setSecurityAnswer("");
    setPasswordResetSessionId("");
    setNewPassword("");
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-outline-variant p-space-lg shadow-sm">
      <div className="mb-6 border-b border-outline-variant pb-4">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Account Settings
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Manage your security credentials and preferences
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl border border-error/20 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-error"
            data-icon="error"
          >
            error
          </span>
          <span className="text-body-md font-medium">{error}</span>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleInitiate} className="space-y-4">
          <h3 className="font-semibold text-on-surface text-lg">
            Reset Password
          </h3>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Login ID / Email
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
              placeholder="e.g. alex.carter@bfsi.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
              placeholder="e.g. +1234567890"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Initiating..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <h3 className="font-semibold text-on-surface text-lg">Verify OTP</h3>
          <p className="text-sm text-on-surface-variant">
            An OTP has been sent to your mobile number. Please enter it below.
          </p>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              OTP Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md text-center tracking-widest font-bold"
              placeholder="e.g. 123456"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleVerifySecurityQuestion} className="space-y-4">
          <h3 className="font-semibold text-on-surface text-lg">
            Security Question
          </h3>
          <p className="text-sm text-on-surface-variant">
            Please answer the security question configured for your account.
          </p>
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant">
            <p className="font-medium text-on-surface">{securityQuestion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Your Answer
            </label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
              placeholder="Enter answer..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify Answer"}
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSetNewPassword} className="space-y-4">
          <h3 className="font-semibold text-on-surface text-lg">
            Set New Password
          </h3>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none text-body-md"
              placeholder="Enter new password..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {step === 5 && (
        <div className="text-center space-y-4 py-6">
          <span
            className="material-symbols-outlined text-6xl text-tertiary-container"
            data-icon="check_circle"
          >
            check_circle
          </span>
          <h3 className="font-semibold text-on-surface text-xl">
            Password Reset Complete
          </h3>
          <p className="text-sm text-on-surface-variant">{successMessage}</p>
          <button
            onClick={resetForm}
            className="bg-primary text-white px-6 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all cursor-pointer"
          >
            Reset Form
          </button>
        </div>
      )}
    </div>
  );
}
