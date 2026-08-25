import React, { useEffect, useState } from "react";
import FilterRow from "../components/catalog/FilterRow";
import ItemCatalogTable from "../components/catalog/ItemCatalogTable";
import { itemService, inventoryService, authService } from "../services/api";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [unitPrice, setUnitPrice] = useState(0.0);
  const [reorderThreshold, setReorderThreshold] = useState(0);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const currentUser = authService.getCurrentUser();
  const canManage =
    currentUser && ["admin", "manager"].includes(currentUser.role);
  const canDelete = currentUser && currentUser.role === "admin";

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsData, invData, warehousesData] = await Promise.all([
        itemService.list(0, 500, search, category),
        inventoryService.list(),
        inventoryService.listWarehouses(),
      ]);

      setItems(itemsData.items || []);
      setInventory(invData || []);
      setWarehouses(warehousesData || []);

      // Extract unique categories for filter dropdown
      if (itemsData.items) {
        const uniqueCats = [
          ...new Set(itemsData.items.map((i) => i.category).filter(Boolean)),
        ];
        setCategories(uniqueCats);
      }
    } catch (err) {
      setError("Failed to fetch catalog data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, category]);

  // Handle quick action trigger from dashboard
  useEffect(() => {
    if (searchParams.get("action") === "add" && canManage) {
      openAddModal();
      // Clear search param so it doesn't reopen on refresh
      setSearchParams({});
    }
  }, [searchParams]);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedItemId(null);
    setSku("");
    setName("");
    setDescription("");
    setItemCategory("");
    setUnitPrice(0.0);
    setReorderThreshold(0);
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setSelectedItemId(item.id);
    setSku(item.sku);
    setName(item.name);
    setDescription(item.description || "");
    setItemCategory(item.category || "");
    setUnitPrice(item.unit_price);
    setReorderThreshold(item.reorder_threshold);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!sku.trim()) return setModalError("SKU is required.");
    if (!name.trim()) return setModalError("Item Name is required.");
    if (unitPrice < 0) return setModalError("Unit Price cannot be negative.");
    if (reorderThreshold < 0)
      return setModalError("Reorder Threshold cannot be negative.");

    setModalLoading(true);
    try {
      const payload = {
        sku: sku.trim(),
        name: name.trim(),
        description: description.trim() || null,
        category: itemCategory.trim() || null,
        unit_price: parseFloat(unitPrice),
        reorder_threshold: parseInt(reorderThreshold),
      };

      if (modalMode === "add") {
        await itemService.create(payload);
      } else {
        await itemService.update(selectedItemId, payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setModalError(
        err.response?.data?.detail || "Failed to save item catalog entry.",
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this item? This will also delete all associated inventory records.",
      )
    ) {
      return;
    }

    try {
      await itemService.delete(id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete item.");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Item Catalog Management
        </h1>
        <p className="text-sm text-gray-500">
          Create, update, and monitor inventory items across warehouses
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Row */}
      <FilterRow
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        categories={categories}
        onAddNewClick={openAddModal}
        canManage={canManage}
      />

      {/* Catalog Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading catalog items...
          </p>
        </div>
      ) : (
        <ItemCatalogTable
          items={items}
          inventory={inventory}
          warehouses={warehouses}
          onEditClick={openEditModal}
          onDeleteClick={handleDeleteItem}
          canManage={canManage}
          canDelete={canDelete}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900">
                {modalMode === "add"
                  ? "Add New Catalog Item"
                  : "Edit Catalog Item"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SKU */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. SKU-9901"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={modalMode === "edit"}
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wireless Mouse"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief description of the item..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="e.g. Electronics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Unit Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Reorder Threshold */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                    Reorder Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
