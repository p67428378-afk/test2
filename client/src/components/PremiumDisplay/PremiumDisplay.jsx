import React from 'react';
import BasePremiumCard from './BasePremiumCard';
import NCBDiscountCard from './NCBDiscountCard';
import VehicleMultiplierCard from './VehicleMultiplierCard';
import FinalPremiumCard from './FinalPremiumCard';
import PolicyDetailsSummary from './PolicyDetailsSummary';

const PremiumDisplay = ({ premiumData, userDetails }) => {
  if (!premiumData) {
    return (
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-xl">
            <header>
                <h2 className="font-headline-md text-headline-md text-on-surface">Your Estimated Premium</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Breakdown of your calculated annual insurance rate.</p>
            </header>
            <div className="space-y-md">
                <div className="bg-surface border border-outline-variant rounded-xl p-md flex justify-center items-center shadow-sm h-32">
                    <p className="text-on-surface-variant">Your premium details will appear here once calculated.</p>
                </div>
            </div>
        </div>
    );
  }

  const { base_premium, ncb_discount, premium_after_ncb, final_premium } = premiumData;
  const vehicle_multiplier = userDetails ? userDetails.vehicle_type_multiplier : 0;
  const ncb_percentage = userDetails ? (1 - (premium_after_ncb / base_premium)) * 100 : 0;
  const multiplier_adjustment = final_premium - premium_after_ncb;


  return (
    <div className="col-span-12 lg:col-span-5 flex flex-col gap-xl">
      <header>
        <h2 className="font-headline-md text-headline-md text-on-surface">Your Estimated Premium</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Breakdown of your calculated annual insurance rate.</p>
      </header>
      <div className="space-y-md">
        <BasePremiumCard premium={base_premium} />
        <NCBDiscountCard discount={ncb_discount} percentage={ncb_percentage.toFixed(0)} />
        <VehicleMultiplierCard multiplier={vehicle_multiplier} adjustment={multiplier_adjustment} />
        <FinalPremiumCard premium={final_premium} />
      </div>
      <PolicyDetailsSummary userDetails={userDetails} />
       {/* Promotional Card */}
       <div className="rounded-xl overflow-hidden relative h-32 mt-xl">
            <img alt="Luxury Vehicle Support" className="w-full h-full object-cover brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKfnAofG6lDQn-PE5YpHxxURh-gNqKRSZrE7CUF0OnfaK-yBzdFU1uvX-lSxbCPFJoGeqy6eOPsFgT934U7gcbDlFZl2yaBXs2hq_mk7gW_0sZJ6hg7rycjImnKEybYGiYPbGz6olih7V6zsFMT0PkO7D7OyCxZ6OmfT4kg7dZX2fOsvebnSOC00A_oEbh2YYP67C5TW-CdtTj90t9otbXBWZWBlB6LIDgnG1Z5y4LyH2nGOj20DX8nRJSujRMF8IAj9__lbAbWHQ"/>
            <div className="absolute inset-0 p-lg flex flex-col justify-center">
                <h4 className="font-headline-md text-headline-md text-white">Need a Hand?</h4>
                <p className="font-body-sm text-body-sm text-white opacity-90">Our advisors are ready to assist you 24/7.</p>
            </div>
        </div>
    </div>
  );
};

export default PremiumDisplay;
