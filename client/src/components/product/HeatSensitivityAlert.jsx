import React from "react";
import PropTypes from "prop-types";
import { ThermometerSnowflake, ShieldAlert, Sparkles } from "lucide-react";

export const HeatSensitivityAlert = ({ compact = false }) => {
  if (compact) {
    return (
      <div
        data-testid="heat-sensitivity-compact"
        className="flex items-center space-x-2 p-2.5 rounded-lg bg-[#FFF3E0] border border-[#E65100]/30 text-[#E65100] text-xs font-medium"
      >
        <ThermometerSnowflake className="w-4 h-4 flex-shrink-0" />
        <span>Heat-Sensitive Item: Cold-pack thermal shipping recommended</span>
      </div>
    );
  }

  return (
    <div
      data-testid="heat-sensitivity-alert"
      className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF3E0] via-[#FFF8E1] to-[#FFF3E0] border border-[#E65100]/40 shadow-sm"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-[#E65100]/10 rounded-xl text-[#E65100] flex-shrink-0">
          <ThermometerSnowflake className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#E65100] text-white">
              Heat Advisory
            </span>
            <h4 className="text-sm font-bold text-[#2D1B18]">
              Heat-Sensitive Item: Cold-pack shipping recommended
            </h4>
          </div>
          <p className="mt-1.5 text-xs text-stone-700 leading-relaxed">
            This artisanal chocolate contains high-purity cocoa butter and
            delicate ganache that naturally begins to soften above{" "}
            <strong>21°C (70°F)</strong>.
          </p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-[#E65100]" />
              <span>Protective foil insulation bag</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#00796B]" />
              <span>Food-safe sub-zero frozen gel packs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeatSensitivityAlert.propTypes = {
  compact: PropTypes.bool,
};

HeatSensitivityAlert.defaultProps = {
  compact: false,
};

export default HeatSensitivityAlert;
