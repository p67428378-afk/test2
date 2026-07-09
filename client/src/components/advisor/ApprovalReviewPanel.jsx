import React from "react";
import {
  CheckCircle,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  HelpCircle,
} from "lucide-react";
import Button from "../common/Button.jsx";

export default function ApprovalReviewPanel({
  selectedScenario,
  projection,
  onSubmit,
  submitting,
}) {
  if (!projection) return null;

  const { guardrails, sku_actions } = projection;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-base font-bold text-gray-900">
          Approval & Review Panel
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Review actions and guardrails for the {selectedScenario} scenario
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SKU Actions Summary */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Assortment Actions Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-1 text-green-600">
                <PlusCircle className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-green-900">
                {sku_actions?.add || 0}
              </p>
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mt-1">
                SKUs to Add
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-1 text-gray-500">
                <HelpCircle className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">
                {sku_actions?.keep || 0}
              </p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mt-1">
                SKUs to Keep
              </p>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg text-center">
              <div className="flex justify-center mb-1 text-red-600">
                <MinusCircle className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-red-900">
                {sku_actions?.remove || 0}
              </p>
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide mt-1">
                SKUs to Remove
              </p>
            </div>
          </div>
        </div>

        {/* Guardrails Compliance */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Guardrails Compliance
          </h3>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm font-semibold text-gray-700">
              <span className="flex items-center">
                {guardrails?.private_brand_mix_ok ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2.5 flex-shrink-0" />
                )}
                Private Brand Mix Guardrail
              </span>
              <span
                className={
                  guardrails?.private_brand_mix_ok
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {guardrails?.private_brand_mix_ok ? "COMPLIANT" : "VIOLATION"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm font-semibold text-gray-700">
              <span className="flex items-center">
                {guardrails?.shelf_capacity_ok ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2.5 flex-shrink-0" />
                )}
                Shelf Capacity Guardrail
              </span>
              <span
                className={
                  guardrails?.shelf_capacity_ok
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {guardrails?.shelf_capacity_ok ? "COMPLIANT" : "VIOLATION"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium max-w-md">
          Submitting this assortment plan will log an audit trail entry and
          update the active cluster configuration.
        </p>
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="px-6 py-2.5 font-bold"
        >
          {submitting ? "Submitting Plan..." : "Submit Assortment Plan"}
        </Button>
      </div>
    </div>
  );
}
