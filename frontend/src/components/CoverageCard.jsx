import React from 'react';

const CoverageCard = ({ icon, title, description, benefit }) => {
  return (
    <div className="group bg-surface-container-lowest p-8 rounded-[2rem] hover:bg-white transition-all duration-300">
      <div className="w-14 h-14 rounded-2xl bg-secondary-container/30 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <h4 className="font-headline font-bold text-xl mb-2 text-on-surface">{title}</h4>
      <p className="text-on-surface-variant leading-relaxed mb-6">{description}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low text-primary font-bold text-sm">
        {benefit}
      </div>
    </div>
  );
};

export default CoverageCard;
