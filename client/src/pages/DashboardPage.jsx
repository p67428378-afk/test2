import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Package,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import StatCard from "../components/common/StatCard";
import AlertBanner from "../components/common/AlertBanner";
import ProductTable from "../components/products/ProductTable";
import ProductRegistrationModal from "../components/products/ProductRegistrationModal";
import ServiceClaimModal from "../components/claims/ServiceClaimModal";
import {
  getProducts,
  getWarrantyStats,
  deleteProduct,
  triggerExpiryEvaluation,
} from "../services/api";

export default function DashboardPage({
  isRegisterModalOpen,
  onToggleRegisterModal,
}) {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total_products: 0,
    active: 0,
    expiring_soon: 0,
    expired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");

  // Claim modal state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimProduct, setClaimProduct] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [productsData, statsData] = await Promise.all([
        getProducts({ limit: 100 }),
        getWarrantyStats(),
      ]);
      setProducts(productsData);
      setStats(statsData);
    } catch (err) {
      setError(
        "Failed to load warranty dashboard data. Please check backend connection.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerEvaluation = async () => {
    try {
      setEvaluating(true);
      await triggerExpiryEvaluation();
      await fetchData();
    } catch (err) {
      console.error("Failed to trigger expiry evaluation:", err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleDelete = async (productId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product registration?",
      )
    )
      return;
    try {
      await deleteProduct(productId);
      fetchData();
    } catch (err) {
      alert(
        "Failed to delete product: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleOpenClaimModal = (product) => {
    setClaimProduct(product);
    setIsClaimModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Warranty Overview Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor registered products, track upcoming expiry dates, and manage
            service claims.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerEvaluation}
            disabled={evaluating}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-xs transition-colors disabled:opacity-50"
            title="Recalculate warranty milestones"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${evaluating ? "animate-spin" : ""}`}
            />
            {evaluating ? "Evaluating..." : "Check Expiries"}
          </button>

          <button
            onClick={onToggleRegisterModal}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Register Product
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-sm text-red-700">
          <AlertCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Registered Products"
          value={stats.total_products}
          icon={Package}
          color="blue"
          onClick={() => setSelectedStatusFilter("ALL")}
          isActive={selectedStatusFilter === "ALL"}
        />
        <StatCard
          title="Active Warranties"
          value={stats.active}
          icon={ShieldCheck}
          color="green"
          onClick={() => setSelectedStatusFilter("ACTIVE")}
          isActive={selectedStatusFilter === "ACTIVE"}
        />
        <StatCard
          title="Expiring Soon (<=30 Days)"
          value={stats.expiring_soon}
          icon={ShieldAlert}
          color="amber"
          description="Action required"
          onClick={() => setSelectedStatusFilter("EXPIRING_SOON")}
          isActive={selectedStatusFilter === "EXPIRING_SOON"}
        />
        <StatCard
          title="Expired Warranties"
          value={stats.expired}
          icon={ShieldX}
          color="red"
          onClick={() => setSelectedStatusFilter("EXPIRED")}
          isActive={selectedStatusFilter === "EXPIRED"}
        />
      </div>

      {/* Urgent Alert Banner */}
      <AlertBanner
        expiringCount={stats.expiring_soon}
        onViewExpiring={() => setSelectedStatusFilter("EXPIRING_SOON")}
      />

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <p className="font-semibold text-sm">Loading Warranty Catalog...</p>
        </div>
      ) : (
        <ProductTable
          products={products}
          onDeleteProduct={handleDelete}
          onOpenClaimModal={handleOpenClaimModal}
          selectedStatus={selectedStatusFilter}
          onStatusChange={setSelectedStatusFilter}
        />
      )}

      {/* Modals */}
      <ProductRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={onToggleRegisterModal}
        onSuccess={fetchData}
      />

      <ServiceClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        product={claimProduct}
        products={products}
        onSuccess={fetchData}
      />
    </div>
  );
}
