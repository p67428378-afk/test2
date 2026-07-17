import { useState, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout.jsx";
import KPIHeaderStrip from "./components/assortment/KPIHeaderStrip.jsx";
import SKUPerformanceSection from "./components/assortment/SKUPerformanceSection.jsx";
import ScenarioSelector from "./components/assortment/ScenarioSelector.jsx";
import ApprovalReviewPanel from "./components/assortment/ApprovalReviewPanel.jsx";
import Modal from "./components/common/Modal.jsx";
import {
  getKPIs,
  getSKUs,
  calculateScenario,
  submitAssortmentReview,
} from "./services/api.js";

export default function App() {
  const [kpis, setKpis] = useState(null);
  const [kpisLoading, setKpisLoading] = useState(true);
  const [kpisError, setKpisError] = useState(null);

  const [skus, setSkus] = useState([]);
  const [skusLoading, setSkusLoading] = useState(true);
  const [skusError, setSkusError] = useState(null);
  const [skuFilter, setSkuFilter] = useState("");

  const [selectedScenario, setSelectedScenario] = useState("Balanced");
  const [calculationData, setCalculationData] = useState(null);
  const [calcLoading, setCalcLoading] = useState(true);
  const [calcError, setCalcError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch KPIs
  useEffect(() => {
    getKPIs()
      .then((data) => {
        setKpis(data);
        setKpisLoading(false);
      })
      .catch((err) => {
        setKpisError(err.message || "Failed to fetch KPIs");
        setKpisLoading(false);
      });
  }, []);

  // Fetch SKUs
  useEffect(() => {
    setSkusLoading(true);
    getSKUs(skuFilter)
      .then((data) => {
        setSkus(data);
        setSkusLoading(false);
      })
      .catch((err) => {
        setSkusError(err.message || "Failed to fetch SKUs");
        setSkusLoading(false);
      });
  }, [skuFilter]);

  // Calculate Scenario
  useEffect(() => {
    setCalcLoading(true);
    calculateScenario(selectedScenario)
      .then((data) => {
        setCalculationData(data);
        setCalcLoading(false);
      })
      .catch((err) => {
        setCalcError(err.message || "Failed to calculate scenario");
        setCalcLoading(false);
      });
  }, [selectedScenario]);

  const handleSubmitReview = () => {
    setSubmitting(true);
    setSubmitError(null);
    submitAssortmentReview(selectedScenario)
      .then((data) => {
        setSubmitResult(data);
        setSubmitting(false);
        setIsModalOpen(true);
      })
      .catch((err) => {
        setSubmitError(err.message || "Failed to submit assortment review");
        setSubmitting(false);
      });
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-6 max-w-[1600px] mx-auto pb-12">
        {/* Row 1: KPIs */}
        <KPIHeaderStrip kpis={kpis} loading={kpisLoading} error={kpisError} />

        {/* Row 2: Split 8/4 */}
        {/* Left Column (8 cols): SKU Performance */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <SKUPerformanceSection
            skus={skus}
            loading={skusLoading}
            error={skusError}
            onFilterChange={setSkuFilter}
            currentFilter={skuFilter}
          />
        </div>

        {/* Right Column (4 cols): Scenario Selector & Review */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <ScenarioSelector
            selectedScenario={selectedScenario}
            onScenarioChange={setSelectedScenario}
          />

          {submitError && (
            <div className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-lg">
              {submitError}
            </div>
          )}

          <ApprovalReviewPanel
            selectedScenario={selectedScenario}
            calculationData={calculationData}
            loading={calcLoading}
            error={calcError}
            onSubmit={handleSubmitReview}
            submitting={submitting}
          />
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submission Successful"
      >
        {submitResult && (
          <div className="space-y-4">
            <p className="text-sm text-[#bbcabf]">
              Your assortment review for the{" "}
              <strong className="text-[#4edea3]">
                {submitResult.scenario_name}
              </strong>{" "}
              scenario has been successfully submitted.
            </p>
            <div className="bg-[#171f33] p-4 rounded border border-[#334155] space-y-2">
              <div>
                <span className="text-xs text-[#bbcabf] block uppercase tracking-wider font-semibold">
                  Submission ID
                </span>
                <span className="text-sm font-mono text-[#dae2fd] break-all">
                  {submitResult.audit_trail_summary?.submission_id ||
                    submitResult.id}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#bbcabf] block uppercase tracking-wider font-semibold">
                  Timestamp
                </span>
                <span className="text-sm font-mono text-[#dae2fd]">
                  {submitResult.audit_trail_summary?.timestamp ||
                    submitResult.created_at}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#bbcabf] block uppercase tracking-wider font-semibold">
                  Submitted By
                </span>
                <span className="text-sm text-[#dae2fd]">
                  {submitResult.submitted_by || "Category Manager"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
