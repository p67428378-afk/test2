import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Layers,
} from "lucide-react";
import { productService } from "../services/api";
import Navbar from "../components/layout/Navbar";
import StatCard from "../components/common/StatCard";
import ProductTable from "../components/warranty/ProductTable";
import Button from "../components/common/Button";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiringSoon: 0,
    expired: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, brandFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (brandFilter) params.manufacturer = brandFilter;
      if (search) params.search = search;

      const data = await productService.list(params);
      setProducts(data.items);

      // Calculate stats based on all products (without filters)
      const allData = await productService.list({ limit: 1000 });
      const total = allData.total;
      let active = 0;
      let expiringSoon = 0;
      let expired = 0;

      allData.items.forEach((item) => {
        const status = item.warranty?.status;
        if (status === "Active") active++;
        else if (status === "Expiring Soon") expiringSoon++;
        else if (status === "Expired") expired++;
      });

      setStats({ total, active, expiringSoon, expired });
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // Get unique brands for filter dropdown
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const allData = await productService.list({ limit: 1000 });
        const uniqueBrands = [
          ...new Set(allData.items.map((item) => item.manufacturer)),
        ].filter(Boolean);
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Failed to load brands", err);
      }
    };
    loadBrands();
  }, []);

  return (
    <div className="bg-[#f7fafc] flex flex-col gap-6 items-start p-8 min-h-screen w-full">
      <Navbar />

      {/* KPI Stats */}
      <div className="flex gap-4 items-start w-full overflow-x-auto pb-2">
        <StatCard
          title="Total Products"
          value={stats.total}
          badgeText="All Items"
          badgeColor="bg-blue-500"
        />
        <StatCard
          title="Active Warranties"
          value={stats.active}
          badgeText="Active"
          badgeColor="bg-[#17a34a]"
        />
        <StatCard
          title="Expiring Soon (30d)"
          value={stats.expiringSoon}
          badgeText={`${stats.expiringSoon} Alert`}
          badgeColor="bg-[#eb9917]"
        />
        <StatCard
          title="Expired Warranties"
          value={stats.expired}
          badgeText={`${stats.expired} Expired`}
          badgeColor="bg-[#db2626]"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center w-full shrink-0 flex-wrap md:flex-nowrap">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 min-w-[250px]"
        >
          <div className="bg-[#f2f5fa] border border-[#e3e8f0] flex flex-1 gap-2 items-center p-3 rounded-xl text-[#707a8c] text-sm">
            <Search className="w-4 h-4 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name, serial number, or manufacturer..."
              className="bg-transparent border-none outline-none w-full text-[#171c29] placeholder-[#707a8c]"
            />
          </div>
        </form>

        <div className="bg-white border border-[#e3e8f0] flex gap-2 items-center p-3 rounded-xl shrink-0 text-sm text-[#171c29]">
          <label htmlFor="status-select" className="font-medium text-[#707a8c]">
            Status:
          </label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="outline-none bg-transparent font-semibold text-[#171c29]"
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="bg-white border border-[#e3e8f0] flex gap-2 items-center p-3 rounded-xl shrink-0 text-sm text-[#171c29]">
          <label htmlFor="brand-select" className="font-medium text-[#707a8c]">
            Brand:
          </label>
          <select
            id="brand-select"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="outline-none bg-transparent font-semibold text-[#171c29]"
          >
            <option value="">All</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={() => navigate("/register-product")}>
          <Plus className="w-4 h-4 mr-1" />
          Register Product
        </Button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
        <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
          Registered Products
        </p>

        {error && <div className="text-red-600 text-sm py-4">{error}</div>}

        {loading ? (
          <div className="text-center py-8 text-[#707a8c] w-full">
            Loading products...
          </div>
        ) : (
          <ProductTable products={products} />
        )}
      </div>
    </div>
  );
}
