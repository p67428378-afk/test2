import React from "react";

export default function BillTipInputCard({
  billAmount,
  setBillAmount,
  tipPercentage,
  setTipPercentage,
  isCustomTip,
  setIsCustomTip,
  numPeople,
  setNumPeople,
  onCalculate,
  onReset,
  loading,
  error,
}) {
  const presetOptions = [10, 15, 18, 20];

  const handlePresetClick = (rate) => {
    setIsCustomTip(false);
    setTipPercentage(rate);
  };

  const handleCustomTipChange = (e) => {
    setIsCustomTip(true);
    const value = e.target.value;
    setTipPercentage(value === "" ? "" : Number(value));
  };

  const handleBillChange = (e) => {
    const value = e.target.value;
    setBillAmount(value === "" ? "" : Number(value));
  };

  const handleNumPeopleChange = (e) => {
    const value = e.target.value;
    setNumPeople(value === "" ? "" : Math.max(1, parseInt(value, 10) || 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <div
      className="bg-white border border-[#e3e8f0] border-solid flex flex-col gap-4 p-6 rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full"
      data-node-id="1:42"
      data-name="Card"
    >
      <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-3">
        <h2 className="font-bold text-[#171c29] text-lg" data-node-id="1:43">
          Bill & Tip Input
        </h2>
        <span className="text-xs text-[#707a8c] font-medium bg-[#f2f5fa] px-2.5 py-1 rounded-full">
          Standard Calculator
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Bill Amount */}
        <div className="flex flex-col gap-1.5 w-full" data-name="Field">
          <label
            htmlFor="bill-amount-input"
            className="font-medium text-[#707a8c] text-xs uppercase tracking-wider"
          >
            Bill Amount ($)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-[#707a8c] font-semibold text-sm">
              $
            </span>
            <input
              id="bill-amount-input"
              type="number"
              step="0.01"
              min="0.01"
              required
              aria-label="Bill Amount in USD"
              placeholder="0.00"
              value={billAmount === "" ? "" : billAmount}
              onChange={handleBillChange}
              className="bg-[#f2f5fa] border border-[#e3e8f0] text-[#171c29] text-base font-medium rounded-[10px] pl-8 pr-4 py-2.5 w-full focus:outline-none focus:border-[#2663eb] focus:ring-2 focus:ring-[#2663eb]/20 transition-all"
            />
          </div>
        </div>

        {/* Preset Tip Percentages */}
        <div className="flex flex-col gap-2 w-full" data-name="Box">
          <label className="font-medium text-[#707a8c] text-xs uppercase tracking-wider">
            Select Tip Percentage
          </label>
          <div className="grid grid-cols-4 gap-2.5 w-full" data-name="FormGrid">
            {presetOptions.map((rate) => {
              const isSelected = !isCustomTip && Number(tipPercentage) === rate;
              return (
                <button
                  key={rate}
                  type="button"
                  aria-label={`${rate} percent tip preset`}
                  onClick={() => handlePresetClick(rate)}
                  className={`py-2.5 px-3 rounded-[10px] text-sm font-semibold transition-all text-center ${
                    isSelected
                      ? "bg-[#2663eb] text-white shadow-sm ring-2 ring-[#2663eb]/40"
                      : "bg-white border border-[#e3e8f0] text-[#171c29] hover:bg-[#f2f5fa]"
                  }`}
                >
                  {rate}%
                </button>
              );
            })}
          </div>

          {/* Custom Tip Input */}
          <div className="flex flex-col gap-1.5 mt-2" data-name="Field">
            <label
              htmlFor="custom-tip-input"
              className="font-medium text-[#707a8c] text-xs"
            >
              Or Enter Custom Tip Percentage (%)
            </label>
            <div className="relative flex items-center">
              <input
                id="custom-tip-input"
                type="number"
                step="0.1"
                min="0"
                max="100"
                aria-label="Custom Tip Percentage"
                placeholder="Custom % (0-100)"
                value={
                  isCustomTip ? (tipPercentage === "" ? "" : tipPercentage) : ""
                }
                onChange={handleCustomTipChange}
                onFocus={() => setIsCustomTip(true)}
                className={`bg-[#f2f5fa] border ${
                  isCustomTip
                    ? "border-[#2663eb] ring-1 ring-[#2663eb]/30"
                    : "border-[#e3e8f0]"
                } text-[#171c29] text-sm font-medium rounded-[10px] px-3.5 py-2.5 w-full focus:outline-none focus:border-[#2663eb] focus:ring-2 focus:ring-[#2663eb]/20 transition-all`}
              />
              <span className="absolute right-3.5 text-[#707a8c] text-sm font-semibold">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Number of People Splitting */}
        <div className="flex flex-col gap-1.5 w-full" data-name="Field">
          <label
            htmlFor="num-people-input"
            className="font-medium text-[#707a8c] text-xs uppercase tracking-wider"
          >
            Number of People Splitting
          </label>
          <div className="relative flex items-center">
            <input
              id="num-people-input"
              type="number"
              min="1"
              step="1"
              required
              aria-label="Number of people splitting the bill"
              placeholder="1"
              value={numPeople === "" ? "" : numPeople}
              onChange={handleNumPeopleChange}
              className="bg-[#f2f5fa] border border-[#e3e8f0] text-[#171c29] text-base font-medium rounded-[10px] px-3.5 py-2.5 w-full focus:outline-none focus:border-[#2663eb] focus:ring-2 focus:ring-[#2663eb]/20 transition-all"
            />
            <span className="absolute right-3.5 text-[#707a8c] text-sm font-medium">
              {Number(numPeople) === 1 ? "person" : "people"}
            </span>
          </div>
        </div>

        {/* Error message display */}
        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-[#dc2626] text-xs rounded-lg p-3 flex items-start gap-2"
          >
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 w-full" data-name="Box">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2663eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-50 text-white font-medium text-sm py-3 px-6 rounded-[10px] flex-1 flex items-center justify-center transition-all shadow-sm"
          >
            {loading ? "Calculating..." : "Calculate Tip"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="bg-white border border-[#e3e8f0] hover:bg-[#f2f5fa] active:bg-[#e3e8f0] text-[#171c29] font-medium text-sm py-3 px-5 rounded-[10px] transition-all"
          >
            Reset All
          </button>
        </div>
      </form>
    </div>
  );
}
