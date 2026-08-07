import React, { useState, useEffect } from "react";
import { productService } from "../services/api";
import KPICard from "../components/catalog/KPICard";
import InventoryTable from "../components/catalog/InventoryTable";
import Button from "../components/common/Button";
import {
  Package,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  Search,
  Plus,
} from "lucide-react";

export default function DashboardPage({ onAddLaptop, onEditLaptop }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");
  const [skip, setSkip] = useState(0);
  const limit = 10;

  // KPI Stats
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await productService.getProducts({
        search,
        brand,
        condition,
        skip,
        limit,
      });
      setProducts(data.items || []);
      setTotal(data.total || 0);

      // Calculate KPIs based on all products (or fetch all to calculate accurately)
      // For greenfield, we can fetch all products to calculate KPIs accurately
      const allData = await productService.getProducts({ limit: 1000 });
      const items = allData.items || [];

      const totalProducts = items.length;
      const lowStock = items.filter(
        (p) => p.stock_quantity > 0 && p.stock_quantity < 3,
      ).length;
      const outOfStock = items.filter((p) => p.stock_quantity === 0).length;
      const totalValue = items.reduce(
        (sum, p) => sum + Number(p.price) * p.stock_quantity,
        0,
      );

      setKpis({
        totalProducts,
        lowStock,
        outOfStock,
        totalValue,
      });
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, brand, condition, skip]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this laptop listing?")
    ) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handlePrevPage = () => {
    if (skip >= limit) {
      setSkip(skip - limit);
    }
  };

  const handleNextPage = () => {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  };

  const brands = ["Lenovo", "Apple", "Dell", "HP", "ASUS", "Acer", "MSI"];
  const conditions = ["New", "Refurbished", "Used"];

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Products
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Manage your laptop inventory and track stock levels.
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <KPICard
          title="Total Products"
          value={kpis.totalProducts}
          icon={Package}
        />
        <KPICard
          title="Low Stock Alert"
          value={kpis.lowStock}
          badge={kpis.lowStock}
          badgeColor="warning"
        />
        <KPICard
          title="Out of Stock"
          value={kpis.outOfStock}
          badge={kpis.outOfStock}
          badgeColor="danger"
        />
        <KPICard
          title="Total Inventory Value"
          value={`$${kpis.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
      </div>

      {/* Filters & Actions */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-5 w-5" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md transition-all text-on-surface"
              placeholder="Search products..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSkip(0);
              }}
            />
          </div>
          <select
            className="w-full sm:w-40 py-2 px-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md text-on-surface-variant appearance-none cursor-pointer"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setSkip(0);
            }}
          >
            <option value="">Brand</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className="w-full sm:w-40 py-2 px-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-body-md text-on-surface-variant appearance-none cursor-pointer"
            value={condition}
            onChange={(e) => {
              setCondition(e.target.value);
              setSkip(0);
            }}
          >
            <option value="">Condition</option>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={onAddLaptop}
          className="w-full md:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Laptop
        </Button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">
          Loading inventory...
        </div>
      ) : (
        <InventoryTable
          products={products}
          onEdit={onEditLaptop}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border border-outline-variant rounded-lg bg-surface-bright flex items-center justify-between">
        <span className="text-label-md text-on-surface-variant">
          Showing {total === 0 ? 0 : skip + 1} to{" "}
          {Math.min(skip + limit, total)} of {total} entries
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handlePrevPage}
            disabled={skip === 0 || loading}
          >
            Prev
          </Button>
          <Button
            variant="secondary"
            onClick={handleNextPage}
            disabled={skip + limit >= total || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
