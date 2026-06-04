import React from 'react';

const VehicleMultiplierCard = ({ vehicleMultiplierAmount, vehicleMultiplier }) => {
    const isDiscount = vehicleMultiplierAmount < 0;
    const textColor = isDiscount ? 'text-secondary' : 'text-error';
    const iconBg = isDiscount ? 'bg-secondary-container' : 'bg-error-container';
    const iconText = isDiscount ? 'text-secondary' : 'text-error';
    const icon = isDiscount ? 'trending_down' : 'trending_up';
    const sign = isDiscount ? '-' : '+';

    return (
        <div className="bg-surface border border-outline-variant rounded-xl p-md flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-md">
                <div className={`w-10 h-10 rounded-lg ${iconBg} bg-opacity-20 flex items-center justify-center ${iconText}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className="font-body-md text-body-md text-on-surface">Vehicle Multiplier ({vehicleMultiplier?.toFixed(1)}x)</span>
            </div>
            <span className={`font-headline-md text-headline-md ${textColor}`}>{sign}${Math.abs(vehicleMultiplierAmount)?.toFixed(2)}</span>
        </div>
    );
};

export default VehicleMultiplierCard;
