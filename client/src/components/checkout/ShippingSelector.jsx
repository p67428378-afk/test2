import React from "react";
import PropTypes from "prop-types";
import { Truck, ThermometerSnowflake, ShieldCheck, Check } from "lucide-react";

export const ShippingSelector = ({
  selectedMethod,
  onChange,
  hasHeatSensitiveItems = false,
}) => {
  return (
    <div className="space-y-4" data-testid="shipping-selector">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-heading font-bold text-[#2D1B18] flex items-center">
          <Truck className="w-5 h-5 mr-2 text-[#D4AF37]" />
          Temperature-Controlled Delivery Options
        </h3>
        {hasHeatSensitiveItems && (
          <span className="text-[11px] font-bold text-[#E65100] bg-[#FFF3E0] px-2.5 py-0.5 rounded-full border border-[#E65100]/20">
            Heat-Sensitive Items in Order
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standard Ground Option */}
        <label
          data-testid="shipping-option-standard"
          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            selectedMethod === "standard_ground"
              ? "border-[#2D1B18] bg-[#FDFBF7] shadow-md"
              : "border-[#E8E2DC] bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="shipping_method"
                value="standard_ground"
                checked={selectedMethod === "standard_ground"}
                onChange={() => onChange("standard_ground")}
                className="accent-[#2D1B18] w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-sm font-bold text-[#2D1B18] block">
                  Standard Ground
                </span>
                <span className="text-xs text-stone-500">
                  3&ndash;5 Business Days
                </span>
              </div>
            </div>
            <span className="text-sm font-bold text-[#2D1B18]">FREE</span>
          </div>

          <p className="mt-4 text-xs text-stone-600 leading-relaxed">
            Standard ambient transport. Suitable for cooler weather or
            non-sensitive items.
          </p>

          {hasHeatSensitiveItems && (
            <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
              ⚠️ Warning: No thermal insulation included. Ambient temperatures
              above 21°C (70°F) may cause melting.
            </div>
          )}
        </label>

        {/* Express Thermal Cold Pack Option */}
        <label
          data-testid="shipping-option-express-thermal"
          className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            selectedMethod === "express_thermal"
              ? "border-[#D4AF37] bg-gradient-to-br from-[#FFFDF9] to-[#FFF8E1] shadow-lg ring-1 ring-[#D4AF37]"
              : "border-[#E8E2DC] bg-white hover:border-stone-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="shipping_method"
                value="express_thermal"
                checked={selectedMethod === "express_thermal"}
                onChange={() => onChange("express_thermal")}
                className="accent-[#2D1B18] w-4 h-4 cursor-pointer"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#2D1B18]">
                    Express Thermal Delivery
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00796B] text-white">
                    Cold Pack
                  </span>
                </div>
                <span className="text-xs text-[#00796B] font-medium">
                  1&ndash;2 Business Days
                </span>
              </div>
            </div>
            <span className="text-sm font-heading font-bold text-[#2D1B18]">
              $15.00
            </span>
          </div>

          <p className="mt-4 text-xs text-stone-700 leading-relaxed">
            Insulated foil thermal wrap with sub-zero food-safe ice packs.
            Guaranteed under <strong>21°C (70°F)</strong>.
          </p>

          <div className="mt-3 flex items-center space-x-2 text-[11px] text-[#00796B] font-semibold bg-[#E0F2F1] p-2 rounded-lg">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>100% Melt-Free Arrival Guarantee Included</span>
          </div>
        </label>
      </div>
    </div>
  );
};

ShippingSelector.propTypes = {
  selectedMethod: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hasHeatSensitiveItems: PropTypes.bool,
};

ShippingSelector.defaultProps = {
  hasHeatSensitiveItems: false,
};

export default ShippingSelector;
