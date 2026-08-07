import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Dropdown from "../common/Dropdown";
import Button from "../common/Button";

export default function LaptopForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    processor: "",
    ram: "",
    storage: "",
    gpu: "",
    screen_size: "",
    condition: "New",
    price: "",
    stock_quantity: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || "",
        model: initialData.model || "",
        processor: initialData.processor || "",
        ram: initialData.ram || "",
        storage: initialData.storage || "",
        gpu: initialData.gpu || "",
        screen_size: initialData.screen_size || "",
        condition: initialData.condition || "New",
        price: initialData.price !== undefined ? String(initialData.price) : "",
        stock_quantity:
          initialData.stock_quantity !== undefined
            ? String(initialData.stock_quantity)
            : "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.model.trim()) newErrors.model = "Model is required";
    if (!formData.processor.trim())
      newErrors.processor = "Processor is required";
    if (!formData.ram.trim()) newErrors.ram = "RAM is required";
    if (!formData.storage.trim()) newErrors.storage = "Storage is required";
    if (!formData.gpu.trim()) newErrors.gpu = "GPU is required";
    if (!formData.screen_size.trim())
      newErrors.screen_size = "Screen size is required";
    if (!formData.condition) newErrors.condition = "Condition is required";

    const priceNum = Number(formData.price);
    if (formData.price === "" || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Price must be a non-negative number";
    }

    const stockNum = Number(formData.stock_quantity);
    if (
      formData.stock_quantity === "" ||
      isNaN(stockNum) ||
      stockNum < 0 ||
      !Number.isInteger(stockNum)
    ) {
      newErrors.stock_quantity =
        "Stock quantity must be a non-negative integer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const conditionOptions = [
    { value: "New", label: "New" },
    { value: "Refurbished", label: "Refurbished" },
    { value: "Used", label: "Used" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          error={errors.brand}
          placeholder="e.g. Lenovo, Apple, Dell"
        />
        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={errors.model}
          placeholder="e.g. ThinkPad X1 Carbon, MacBook Pro 14"
        />
        <Input
          label="Processor"
          name="processor"
          value={formData.processor}
          onChange={handleChange}
          error={errors.processor}
          placeholder="e.g. Intel i7-13700H, Apple M2 Pro"
        />
        <Input
          label="RAM"
          name="ram"
          value={formData.ram}
          onChange={handleChange}
          error={errors.ram}
          placeholder="e.g. 16GB, 32GB"
        />
        <Input
          label="Storage"
          name="storage"
          value={formData.storage}
          onChange={handleChange}
          error={errors.storage}
          placeholder="e.g. 512GB SSD, 1TB NVMe"
        />
        <Input
          label="GPU"
          name="gpu"
          value={formData.gpu}
          onChange={handleChange}
          error={errors.gpu}
          placeholder="e.g. NVIDIA RTX 4060, Integrated Intel Iris Xe"
        />
        <Input
          label="Screen Size"
          name="screen_size"
          value={formData.screen_size}
          onChange={handleChange}
          error={errors.screen_size}
          placeholder="e.g. 14-inch, 15.6-inch"
        />
        <Dropdown
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          options={conditionOptions}
          error={errors.condition}
        />
        <Input
          label="Price ($)"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          placeholder="e.g. 1299.99"
        />
        <Input
          label="Stock Quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity}
          onChange={handleChange}
          error={errors.stock_quantity}
          placeholder="e.g. 10"
        />
      </div>

      <div className="flex justify-end gap-4 border-t border-outline-variant pt-6">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Laptop"
              : "Add Laptop"}
        </Button>
      </div>
    </form>
  );
}
