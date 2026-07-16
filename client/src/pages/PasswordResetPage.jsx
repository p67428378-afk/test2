import React, { useState } from "react";
import { Key, ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { passwordResetApi } from "../services/api";

export default function PasswordResetPage({ onBack }) {
  const [step, setStep] = useState(1); // 1: Initiate, 2: Verify OTP, 3: Security Question, 4: Set Password, 5: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form states
  const [loginId, setLoginId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSessionId, setOtpSessionId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityQuestionSessionId, setSecurityQuestionSessionId] =
    useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [passwordResetSessionId, setPasswordResetSessionId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleInitiate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await passwordResetApi.initiate({
        login_id: loginId,
        mobile_number: mobileNumber,
      });
      setOtpSessionId(res.otp_session_id);
      setSecurityQuestion(res.security_question);
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
      const res = await passwordResetApi.verifyOtp({
        otp_code: otpCode,
        otp_session_id: otpSessionId,
      });
      setSecurityQuestionSessionId(res.security_question_session_id);
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
      const res = await passwordResetApi.verifySecurityQuestion({
        answer: securityAnswer,
        security_question_session_id: securityQuestionSessionId,
      });
      setPasswordResetSessionId(res.password_reset_session_id);
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
      const res = await passwordResetApi.setNewPassword({
        new_password: newPassword,
        password_reset_session_id: passwordResetSessionId,
      });
      setSuccessMsg(res.status);
      setStep(5);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to set new password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border border-[#E2E8F0] p-lg shadow-ambient flex flex-col gap-md">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md self-start"
      >
        <ArrowLeft size={18} /> Back to Catalog
      </button>

      <div className="text-center flex flex-col items-center gap-xs">
        <Key className="text-gold" size={48} />
        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
          Reset Password
        </h2>
        <p className="font-label-md text-on-surface-variant">
          Step {step} of 5
        </p>
      </div>

      {error && (
        <div className="p-sm bg-error-container text-on-error-container rounded border border-error/20 font-label-md">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleInitiate} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant">
              Login ID / Username
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none"
              placeholder="harry_potter"
              required
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant">
              Mobile Number
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none"
              placeholder="+1234567890"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-[#B45309] text-white font-label-md py-2 rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              "Initiate Reset"
            )}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-md">
          <p className="font-body-md text-on-surface-variant text-center">
            An OTP has been sent to your mobile number. Please enter it below.
          </p>
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant">
              OTP Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none"
              placeholder="123456"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-[#B45309] text-white font-label-md py-2 rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={handleVerifySecurityQuestion}
          className="flex flex-col gap-md"
        >
          <p className="font-body-md text-on-surface-variant text-center">
            Please answer your security question to verify your identity.
          </p>
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant font-bold">
              {securityQuestion}
            </label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none"
              placeholder="Your answer"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-[#B45309] text-white font-label-md py-2 rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              "Verify Answer"
            )}
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSetNewPassword} className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-[#E2E8F0] rounded focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-[#B45309] text-white font-label-md py-2 rounded transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              "Set New Password"
            )}
          </button>
        </form>
      )}

      {step === 5 && (
        <div className="text-center flex flex-col items-center gap-md">
          <ShieldCheck className="text-[#059669]" size={64} />
          <h3 className="font-headline-md text-on-surface font-bold">
            {successMsg || "Password Reset Successful!"}
          </h3>
          <p className="font-body-md text-on-surface-variant">
            Your password has been successfully updated. You can now log in with
            your new credentials.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-gold hover:bg-[#B45309] text-white font-label-md py-2 rounded transition-all"
          >
            Return to Catalog
          </button>
        </div>
      )}
    </div>
  );
}
