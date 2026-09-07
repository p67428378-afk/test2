import React from "react";

const QuantityControl = ({ quantity, onChangeQuantity }) => {
  const handleChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    onChangeQuantity(val);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label
          htmlFor="quantity-input"
          className="block text-xs font-semibold text-[#849495] uppercase tracking-wider"
        >
          Quantity (1-10)
        </label>
        <span className="text-xs font-bold text-[#00f0ff]">
          {quantity} Names
        </span>
      </div>
      <div className="flex items-center gap-4">
        <input
          id="quantity-range"
          type="range"
          min="1"
          max="10"
          value={quantity}
          onChange={handleChange}
          className="w-full accent-[#00f0ff] cursor-pointer bg-[#051424]"
        />
        <input
          id="quantity-input"
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={handleChange}
          className="w-16 p-2 bg-[#051424] border border-[#273647] rounded-lg text-sm text-center text-[#d4e4fa] focus:outline-none focus:border-[#00f0ff]"
        />
      </div>
    </div>
  );
};

export default QuantityControl;
