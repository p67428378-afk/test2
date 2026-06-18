import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import SweepOverviewCard from "../components/sweeping/SweepOverviewCard.jsx";
import CreateRuleForm from "../components/sweeping/CreateRuleForm.jsx";
import ActiveRulesTable from "../components/sweeping/ActiveRulesTable.jsx";
import FXRateLockCard from "../components/sweeping/FXRateLockCard.jsx";
import ParameterAdjustmentsCard from "../components/sweeping/ParameterAdjustmentsCard.jsx";
import BottomActionBar from "../components/sweeping/BottomActionBar.jsx";
import {
  getRules,
  createRule,
  updateRule,
  getWorkflowDetails,
  pauseWorkflow,
  approveWorkflow,
  rejectWorkflow,
  adjustWorkflow,
} from "../services/api.js";

const DashboardPage = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [workflowDetails, setWorkflowDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRulesList = async () => {
    try {
      const data = await getRules();
      setRules(data);
      if (data.length > 0 && !selectedRule) {
        setSelectedRule(data[0]);
      } else if (selectedRule) {
        const updated = data.find((r) => r.id === selectedRule.id);
        if (updated) setSelectedRule(updated);
      }
    } catch (err) {
      console.error("Failed to fetch rules:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflowInfo = async (ruleId) => {
    try {
      const details = await getWorkflowDetails(ruleId);
      setWorkflowDetails(details);
    } catch (err) {
      console.error("Failed to fetch workflow details:", err);
    }
  };

  useEffect(() => {
    fetchRulesList();
  }, []);

  useEffect(() => {
    if (selectedRule) {
      fetchWorkflowInfo(selectedRule.id);
    } else {
      setWorkflowDetails(null);
    }
  }, [selectedRule]);

  const handleRuleCreated = async (ruleData) => {
    await createRule(ruleData);
    await fetchRulesList();
  };

  const handleAdjustParameters = async (ruleId, adjustData) => {
    await adjustWorkflow(ruleId, adjustData);
    await fetchRulesList();
  };

  const handleApprove = async (ruleId) => {
    try {
      await approveWorkflow(ruleId);
      await fetchRulesList();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to approve workflow");
    }
  };

  const handleReject = async (ruleId) => {
    try {
      await rejectWorkflow(ruleId);
      await fetchRulesList();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to reject workflow");
    }
  };

  const handlePause = async (ruleId) => {
    try {
      await pauseWorkflow(ruleId);
      await fetchRulesList();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to pause workflow");
    }
  };

  return (
    <AppLayout>
      <SweepOverviewCard rules={rules} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <CreateRuleForm onRuleCreated={handleRuleCreated} />
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <FXRateLockCard
            workflowDetails={workflowDetails}
            onRefresh={() => selectedRule && fetchWorkflowInfo(selectedRule.id)}
          />
          <ParameterAdjustmentsCard
            rule={selectedRule}
            onAdjust={handleAdjustParameters}
          />
        </div>
      </div>
      <ActiveRulesTable
        rules={rules}
        onSelectRule={setSelectedRule}
        selectedRuleId={selectedRule?.id}
      />
      <BottomActionBar
        rule={selectedRule}
        onApprove={handleApprove}
        onReject={handleReject}
        onPause={handlePause}
      />
      <div className="h-20"></div> {/* Spacer for bottom action bar */}
    </AppLayout>
  );
};

export default DashboardPage;
