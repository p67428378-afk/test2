import React, { useState } from "react";
import PropTypes from "prop-types";
import { ShieldCheck } from "lucide-react";

export default function NewCardForm({ isLoggedIn, onSubmit, isSubmitting }) {
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(true);
  const [errors, setErrors] = useState({});

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    // Format as 4-digit groups
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      let formatted = value;
      if (value.length > 2) {
        formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      setExpiry(formatted);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    const rawCardNumber = cardNumber.replace(/\s+/g, "");
    if (rawCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be exactly 16 digits";
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Expiry date must be in MM/YY format";
    } else {
      const [month] = expiry.split("/").map(Number);
      if (month < 1 || month > 12) {
        newErrors.expiry = "Invalid month";
      }
    }

    if (cvv.length < 3 || cvv.length > 4) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const rawCardNumber = cardNumber.replace(/\s+/g, "");
    const cardBrand = rawCardNumber.startsWith("4") ? "Visa" : "Mastercard";
    const [month, year] = expiry.split("/");
    const cardExpiryDate = `20${year}-${month}-01`; // Format as YYYY-MM-DD

    // Simulate Stripe tokenization
    const paymentToken = `tok_${Math.random().toString(36).substring(2, 15)}`;

    onSubmit({
      cardholderName,
      cardNumber: rawCardNumber,
      cardBrand,
      cardExpiryDate,
      cardLastFour: rawCardNumber.slice(-4),
      cvv,
      saveCard: isLoggedIn && saveCard,
      paymentToken,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-300">
          Cardholder Name
        </label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className={`bg-slate-900 border rounded-md py-2 px-3 font-body-sm text-body-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
            errors.cardholderName ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.cardholderName && (
          <span className="text-red-500 text-xs">{errors.cardholderName}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-300">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="4111 1111 1111 1111"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={`bg-slate-900 border rounded-md py-2 px-3 w-full font-body-sm text-body-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none pr-16 ${
              errors.cardNumber ? "border-red-500" : "border-slate-700"
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs italic">
            STRIPE
          </span>
        </div>
        {errors.cardNumber && (
          <span className="text-red-500 text-xs">{errors.cardNumber}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-300">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            className={`bg-slate-900 border rounded-md py-2 px-3 font-body-sm text-body-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
              errors.expiry ? "border-red-500" : "border-slate-700"
            }`}
          />
          {errors.expiry && (
            <span className="text-red-500 text-xs">{errors.expiry}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-300">CVV</label>
          <input
            type="password"
            placeholder="***"
            value={cvv}
            onChange={handleCvvChange}
            className={`bg-slate-900 border rounded-md py-2 px-3 font-body-sm text-body-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none ${
              errors.cvv ? "border-red-500" : "border-slate-700"
            }`}
          />
          {errors.cvv && (
            <span className="text-red-500 text-xs">{errors.cvv}</span>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="form-checkbox h-4 w-4 text-indigo-600 bg-transparent border-slate-700 rounded focus:ring-indigo-500 focus:ring-offset-slate-900"
          />
          <span className="font-body-sm text-body-sm text-slate-200">
            Save this card for future use
          </span>
          <ShieldCheck
            className="text-indigo-400 w-4 h-4"
            title="PCI Compliant Storage"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm mt-4"
      >
        {isSubmitting ? "Processing..." : "Submit Payment Details"}
      </button>
    </form>
  );
}

NewCardForm.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

NewCardForm.defaultProps = {
  isSubmitting: false,
};
