import React from "react";
import GateControlTerminal from "../components/GateControlTerminal";
import GateControlDashboard from "../components/GateControlDashboard";

const SecurityGatePage = () => {
  return (
    <div className="space-y-8">
      <GateControlTerminal />
      <GateControlDashboard />
    </div>
  );
};

export default SecurityGatePage;
