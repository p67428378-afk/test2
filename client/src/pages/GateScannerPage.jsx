import React, { useState } from "react";
import GateValidationScanner from "../components/gate/GateValidationScanner";
import GateScanAuditLog from "../components/gate/GateScanAuditLog";

export default function GateScannerPage() {
  const [auditLogs, setAuditLogs] = useState([]);

  const handleScanResult = (scanObj) => {
    setAuditLogs((prev) => [scanObj, ...prev]);
  };

  return (
    <div className="p-6 space-y-6">
      <GateValidationScanner onScanResult={handleScanResult} />
      <GateScanAuditLog auditLogs={auditLogs} />
    </div>
  );
}
