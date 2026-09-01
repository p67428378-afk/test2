import React from "react";
import BasePremiumCard from "./BasePremiumCard";
import NCBDiscountCard from "./NCBDiscountCard";
import VehicleMultiplierCard from "./VehicleMultiplierCard";
import FinalPremiumCard from "./FinalPremiumCard";
import PolicyDetailsSummary from "./PolicyDetailsSummary";

const PremiumDisplay = ({ premium }) => {
  if (!premium) {
    return (
      <div className="bg-surface border border-outline-variant rounded-xl p-lg text-center shadow-sm">
        <p className="font-body-md text-on-surface-variant">
          Your premium details will appear here once calculated.
        </p>
      </div>
    );
  }

  const {
    base_premium,
    ncb_discount,
    premium_after_ncb,
    final_premium,
    policy_id,
  } = premium;
  const ncb_percentage = (ncb_discount / base_premium) * 100;
  const vehicle_multiplier_amount = final_premium - premium_after_ncb;
  const vehicle_multiplier =
    base_premium > 0
      ? (premium_after_ncb + vehicle_multiplier_amount) / premium_after_ncb
      : 1;

  return (
    <div className="space-y-md">
      <BasePremiumCard basePremium={base_premium} />
      <NCBDiscountCard
        ncbDiscount={ncb_discount}
        ncbPercentage={ncb_percentage}
      />
      <VehicleMultiplierCard
        vehicleMultiplierAmount={vehicle_multiplier_amount}
        vehicleMultiplier={vehicle_multiplier}
      />
      <FinalPremiumCard finalPremium={final_premium} />
      <PolicyDetailsSummary policyId={policy_id} />
    </div>
  );
};

export default PremiumDisplay;
