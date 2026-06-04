import React, { useState } from 'react';
import PremiumForm from '../components/PremiumForm/PremiumForm';
import PremiumDisplay from '../components/PremiumDisplay/PremiumDisplay';

const PremiumCalculatorPage = () => {
  const [premiumData, setPremiumData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  return (
    <main className="flex-grow hero-gradient">
      <div className="max-w-[1440px] mx-auto px-lg py-xl grid grid-cols-12 gap-xl">
        {/* Left Column: Input Forms */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-xl">
          <header>
            <h1 className="font-headline-md text-headline-md text-on-surface">Calculate Your Premium</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Complete the details below to generate a real-time insurance quote based on your profile.</p>
          </header>
          {/* Stepper Progress (Modern UI addition) */}
          <div className="flex items-center gap-sm mb-base">
            <div className="flex items-center gap-xs">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-label-sm">1</span>
              <span className="font-label-md text-label-md text-primary">Details</span>
            </div>
            <div className="h-[2px] w-12 bg-outline-variant"></div>
            <div className="flex items-center gap-xs">
              <span className={`w-6 h-6 rounded-full ${premiumData ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'} flex items-center justify-center text-label-sm`}>2</span>
              <span className={`font-label-md text-label-md ${premiumData ? 'text-primary' : 'text-on-surface-variant'}`}>Review</span>
            </div>
          </div>
          <PremiumForm setPremiumData={setPremiumData} setUserDetails={setUserDetails} />
        </div>

        {/* Right Column: Results Display */}
        <PremiumDisplay premiumData={premiumData} userDetails={userDetails} />
      </div>
    </main>
  );
};

export default PremiumCalculatorPage;
