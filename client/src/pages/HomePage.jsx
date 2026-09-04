import React, { useState } from "react";
import FeedbackSubmissionForm from "../components/FeedbackSubmissionForm";
import LoginModal from "../components/LoginModal";

export default function HomePage({ onNavigateAdmin }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleOpenAdmin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      onNavigateAdmin();
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    onNavigateAdmin();
  };

  return (
    <>
      <FeedbackSubmissionForm onOpenAdmin={handleOpenAdmin} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
