import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { productService, documentService } from "../../services/api";
import Button from "../common/Button";

export default function RegistrationForm({ onStepChange }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("Laptops");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyDuration, setWarrantyDuration] = useState("");
  const [isLifetime, setIsLifetime] = useState(false);
  const [receiptId, setReceiptId] = useState(null);
  const [receiptName, setReceiptName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const data = await documentService.upload(file);
      setReceiptId(data.id);
      setReceiptName(file.name);
      onStepChange(3); // Move stepper to step 3
    } catch (err) {
      setError("Failed to upload receipt. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !serialNumber || !manufacturer || !purchaseDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLifetime && !warrantyDuration) {
      setError("Please specify warranty duration or select Lifetime Warranty.");
      return;
    }

    try {
      await productService.create({
        name,
        serial_number: serialNumber,
        manufacturer,
        category,
        purchase_date: purchaseDate,
        warranty_duration_months: isLifetime
          ? null
          : parseInt(warrantyDuration, 10),
        is_lifetime: isLifetime,
        receipt_id: receiptId,
      });
      setSuccess("Product registered successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      if (err.response?.status === 422) {
        setError(
          err.response.data.detail ||
            "Validation error. Please check your inputs.",
        );
      } else {
        setError("Failed to register product. Please try again.");
      }
    }
  };

  const handleFieldFocus = (step) => {
    onStepChange(step);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e3e8f0] flex flex-col gap-4 p-6 rounded-2xl shadow-sm w-full shrink-0"
    >
      <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
        Register New Product
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="flex flex-col gap-1 items-start w-full shrink-0">
        <label
          htmlFor="product-name"
          className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
        >
          Product Name *
        </label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => handleFieldFocus(1)}
          placeholder="e.g., Dell XPS 15"
          className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
          required
        />
      </div>

      <div className="flex flex-col gap-1 items-start w-full shrink-0">
        <label
          htmlFor="serial-number"
          className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
        >
          Serial Number *
        </label>
        <input
          id="serial-number"
          type="text"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          onFocus={() => handleFieldFocus(1)}
          placeholder="e.g., SN-98765"
          className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
          required
        />
      </div>

      <div className="flex gap-4 w-full shrink-0">
        <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
          <label
            htmlFor="manufacturer"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Manufacturer/Vendor *
          </label>
          <input
            id="manufacturer"
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            onFocus={() => handleFieldFocus(1)}
            placeholder="e.g., Dell"
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
            required
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
          <label
            htmlFor="category"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => handleFieldFocus(1)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
          >
            <option value="Laptops">Laptops</option>
            <option value="Phones">Phones</option>
            <option value="Audio">Audio</option>
            <option value="Accessories">Accessories</option>
            <option value="Appliances">Accessories</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 w-full shrink-0">
        <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
          <label
            htmlFor="purchase-date"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Purchase Date *
          </label>
          <input
            id="purchase-date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            onFocus={() => handleFieldFocus(2)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
            required
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 items-start min-w-0">
          <label
            htmlFor="warranty-duration"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Warranty Duration (Months)
          </label>
          <input
            id="warranty-duration"
            type="number"
            value={warrantyDuration}
            onChange={(e) => setWarrantyDuration(e.target.value)}
            onFocus={() => handleFieldFocus(2)}
            disabled={isLifetime}
            placeholder="e.g., 24"
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb] disabled:opacity-50"
            required={!isLifetime}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center w-full shrink-0 py-2">
        <input
          id="lifetime-warranty"
          type="checkbox"
          checked={isLifetime}
          onChange={(e) => {
            setIsLifetime(e.target.checked);
            if (e.target.checked) {
              setWarrantyDuration("");
            }
          }}
          onFocus={() => handleFieldFocus(2)}
          className="bg-[#f2f5fa] border border-[#e3e8f0] rounded w-4.5 h-4.5 text-[#2663eb] focus:ring-[#2663eb]"
        />
        <label
          htmlFor="lifetime-warranty"
          className="font-normal text-[#171c29] text-sm whitespace-nowrap select-none"
        >
          Lifetime Warranty (Overrides duration)
        </label>
      </div>

      <div className="flex flex-col gap-1 items-start w-full shrink-0">
        <p className="font-medium text-[#707a8c] text-xs whitespace-nowrap">
          Upload Proof of Purchase / Receipt
        </p>
        <div className="border-2 border-dashed border-[#e3e8f0] hover:border-[#2663eb] transition-colors rounded-xl p-6 w-full flex flex-col items-center justify-center gap-2 bg-[#f2f5fa] relative cursor-pointer">
          <input
            type="file"
            onChange={handleFileUpload}
            onFocus={() => handleFieldFocus(3)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,image/*"
          />
          <Upload className="w-8 h-8 text-[#707a8c]" />
          <p className="text-sm text-[#171c29] font-medium text-center">
            {uploading
              ? "Uploading..."
              : receiptName
                ? `Selected: ${receiptName}`
                : "Drag & drop receipt PDF/Image here or click to browse..."}
          </p>
          <p className="text-xs text-[#707a8c] text-center">
            Supports PDF, PNG, JPG up to 10MB
          </p>
        </div>
      </div>

      <div className="flex gap-3 items-center justify-end w-full shrink-0 mt-4">
        <Button variant="secondary" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploading}>
          Register Product
        </Button>
      </div>
    </form>
  );
}
