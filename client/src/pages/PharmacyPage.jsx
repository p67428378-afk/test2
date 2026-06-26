import React, { useState } from "react";

export default function PharmacyPage({ medications, onCreateMedication }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    price: 0,
    stock_quantity: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? parseFloat(value) || 0
          : name === "stock_quantity"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.name ||
      !formData.code ||
      formData.price <= 0 ||
      formData.stock_quantity < 0
    ) {
      setError("Please fill in all required fields correctly.");
      setLoading(false);
      return;
    }

    try {
      await onCreateMedication(formData);
      setSuccess("Medication added to catalog successfully!");
      setFormData({
        name: "",
        code: "",
        description: "",
        price: 0,
        stock_quantity: 0,
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add medication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-section-gap">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
          Pharmacy Management
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Manage pharmacy inventory, prescription dispensing, and medication
          catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gutter">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Medication Catalog
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Current stock and pricing of medications
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                    Code
                  </th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                    Name
                  </th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                    Description
                  </th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                    Price
                  </th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                    Stock Quantity
                  </th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
                {medications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-on-surface-variant"
                    >
                      No medications in catalog. Add a medication to get
                      started.
                    </td>
                  </tr>
                ) : (
                  medications.map((med) => (
                    <tr
                      key={med.id}
                      className="hover:bg-surface-container-low transition-colors h-[56px] group"
                    >
                      <td className="py-3 px-4 font-medium">{med.code}</td>
                      <td className="py-3 px-4 font-semibold">{med.name}</td>
                      <td className="py-3 px-4">{med.description || "N/A"}</td>
                      <td className="py-3 px-4 font-bold">
                        ${med.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">{med.stock_quantity}</td>
                      <td className="py-3 px-4">
                        {med.stock_quantity > 10 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            In Stock
                          </span>
                        ) : med.stock_quantity > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-container text-error border border-error/20">
                            Out of Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-bold">
              Add New Medication
            </h3>

            {error && (
              <div
                className="mb-4 p-3 bg-error-container text-error rounded-lg text-sm font-medium"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="name"
                >
                  Medication Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Amoxicillin"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="code"
                >
                  Medication Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. AMX500"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Antibiotic"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="price"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="stock_quantity"
                >
                  Initial Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  required
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Medication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
