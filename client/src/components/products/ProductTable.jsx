import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Shield,
  Eye,
  Wrench,
  Trash2,
  Calendar,
  FileText,
} from "lucide-react";
import Badge from "../common/Badge";

export default function ProductTable({
  products = [],
  onDeleteProduct,
  onOpenClaimModal,
  selectedStatus = "ALL",
  onStatusChange,
}) {
  const [searchTerm, setSearchType] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Extract unique categories
  const categories = [
    "ALL",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.warranty?.vendor_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" ||
      (product.warranty && product.warranty.status === selectedStatus);

    const matchesCategory =
      categoryFilter === "ALL" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name, serial number, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchType(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="ALL">All Warranties</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          {categories.length > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-gray-500 uppercase">
                Category:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-primary focus:border-primary outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
            <tr>
              <th className="px-6 py-3.5">Product & Serial</th>
              <th className="px-6 py-3.5">Brand / Category</th>
              <th className="px-6 py-3.5">Purchase Date</th>
              <th className="px-6 py-3.5">Warranty Expiry</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <Shield className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                  <p className="font-semibold text-gray-600">
                    No products found
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search terms or filter criteria.
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {product.product_name}
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      S/N: {product.serial_number}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">
                      {product.brand || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.category || "General"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      {product.purchase_date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                    {product.warranty ? (
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.warranty.end_date}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {product.warranty.duration_months} Months Total
                        </div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.warranty ? (
                      <Badge status={product.warranty.status} />
                    ) : (
                      <Badge status="UNKNOWN" text="No Warranty" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex items-center p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() =>
                        onOpenClaimModal && onOpenClaimModal(product)
                      }
                      className="inline-flex items-center p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="File Service Claim"
                    >
                      <Wrench className="h-4 w-4" />
                    </button>

                    {onDeleteProduct && (
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="inline-flex items-center p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
        <span>
          Showing {filteredProducts.length} of {products.length} registered
          products
        </span>
      </div>
    </div>
  );
}
