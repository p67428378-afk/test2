import React from 'react';

const FinalPremiumCard = ({ finalPremium }) => {
    return (
        <div className="bg-secondary-container text-on-secondary-container rounded-xl p-xl shadow-lg border-2 border-secondary relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-on-secondary-container opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex flex-col items-center gap-sm relative z-10">
                <span className="font-label-md text-label-md uppercase tracking-widest opacity-80">Final Premium</span>
                <span className="font-display text-display text-[#10B981] drop-shadow-sm">${finalPremium?.toFixed(2)}</span>
                <p className="font-body-sm text-body-sm opacity-70 italic">Calculated for 12 months coverage</p>
            </div>
        </div>
    );
};

export default FinalPremiumCard;
