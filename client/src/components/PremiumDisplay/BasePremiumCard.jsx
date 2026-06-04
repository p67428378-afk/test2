import React from 'react';

const BasePremiumCard = ({ basePremium }) => {
    return (
        <div className="bg-surface border border-outline-variant rounded-xl p-md flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="font-body-md text-body-md text-on-surface">Base Premium</span>
            </div>
            <span className="font-headline-md text-headline-md text-on-surface">${basePremium?.toFixed(2)}</span>
        </div>
    );
};

export default BasePremiumCard;
