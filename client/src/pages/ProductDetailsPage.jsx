import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { productService, claimService } from "../services/api";
import Navbar from "../components/layout/Navbar";
import ProductInfoCard from "../components/warranty/ProductInfoCard";
import ReceiptCard from "../components/warranty/ReceiptCard";
import ClaimHistoryTable from "../components/warranty/ClaimHistoryTable";
import ClaimForm from "../components/warranty/ClaimForm";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.get(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmitted = (newClaim) => {
    // Refresh product details to show the new claim in history
    fetchProductDetails();
  };

  const handleUpdateClaimStatus = async (
    claimId,
    newStatus,
    resolutionNotes = "",
  ) => {
    try {
      await claimService.update(claimId, {
        status: newStatus,
        resolution_notes: resolutionNotes || undefined,
      });
      fetchProductDetails();
    } catch (err) {
      alert("Failed to update claim status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f7fafc] flex flex-col gap-6 items-start p-8 min-h-screen w-full">
        <Navbar />
        <div className="text-center py-8 text-[#707a8c] w-full">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#f7fafc] flex flex-col gap-6 items-start p-8 min-h-screen w-full">
        <Navbar />
        <div className="text-red-600 text-sm py-4 w-full text-center">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7fafc] flex flex-col gap-6 items-start p-8 min-h-screen w-full">
      <Navbar />

      <div className="flex items-center w-full shrink-0">
        <Link
          to="/"
          className="font-medium text-[#2663eb] text-sm flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Left Column: Product Info & Receipt */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <ProductInfoCard product={product} />
          <ReceiptCard receipt={product.receipt} />
        </div>

        {/* Right Column: Claim History & Submit Claim */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <ClaimHistoryTable
            claims={product.claims}
            onUpdateStatus={handleUpdateClaimStatus}
          />
          <ClaimForm
            product={product}
            onClaimSubmitted={handleClaimSubmitted}
          />
        </div>
      </div>
    </div>
  );
}
