import React from "react";
import ParentCoppaCard from "../components/parent/ParentCoppaCard.jsx";
import ParentActivityLog from "../components/parent/ParentActivityLog.jsx";

export default function ParentPortalPage({
  user,
  habits,
  completedHabitIds,
  onVerifyConsent,
}) {
  return (
    <div className="space-y-8">
      {/* COPPA Consent Verification Card */}
      <ParentCoppaCard user={user} onVerifyConsent={onVerifyConsent} />

      {/* Child Activity History Log */}
      <ParentActivityLog
        completedHabitIds={completedHabitIds}
        habits={habits}
      />
    </div>
  );
}
