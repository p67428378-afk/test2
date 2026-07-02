import React from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { Package, User, MapPin } from "lucide-react";

export default function ShipmentForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = React.useState({
    sender_name: "",
    sender_phone: "",
    sender_address: "",
    sender_city: "",
    recipient_name: "",
    recipient_phone: "",
    recipient_address: "",
    recipient_city: "",
    weight: "",
    width: "",
    height: "",
    length: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Structure payload according to API contract
    const payload = {
      sender_details: {
        name: formData.sender_name,
        phone: formData.sender_phone,
        address: formData.sender_address,
        city: formData.sender_city,
      },
      recipient_details: {
        name: formData.recipient_name,
        phone: formData.recipient_phone,
        address: formData.recipient_address,
        city: formData.recipient_city,
      },
      package_details: {
        weight: parseFloat(formData.weight),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        length: parseFloat(formData.length),
        description: formData.description || undefined,
      },
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
    >
      {/* Sender Details */}
      <div>
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
          <User className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-gray-800">Sender Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="sender_name"
            value={formData.sender_name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
          <Input
            label="Phone Number"
            name="sender_phone"
            value={formData.sender_phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 019-2834"
          />
          <Input
            label="Street Address"
            name="sender_address"
            value={formData.sender_address}
            onChange={handleChange}
            required
            placeholder="123 Main St"
            className="md:col-span-2"
          />
          <Input
            label="City"
            name="sender_city"
            value={formData.sender_city}
            onChange={handleChange}
            required
            placeholder="New York"
          />
        </div>
      </div>

      {/* Recipient Details */}
      <div>
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
          <MapPin className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-gray-800">Recipient Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="recipient_name"
            value={formData.recipient_name}
            onChange={handleChange}
            required
            placeholder="Jane Smith"
          />
          <Input
            label="Phone Number"
            name="recipient_phone"
            value={formData.recipient_phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 019-5678"
          />
          <Input
            label="Street Address"
            name="recipient_address"
            value={formData.recipient_address}
            onChange={handleChange}
            required
            placeholder="456 Oak Ave"
            className="md:col-span-2"
          />
          <Input
            label="City"
            name="recipient_city"
            value={formData.recipient_city}
            onChange={handleChange}
            required
            placeholder="Los Angeles"
          />
        </div>
      </div>

      {/* Package Details */}
      <div>
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
          <Package className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-gray-800">Package Specifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            step="0.1"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
            placeholder="1.5"
          />
          <Input
            label="Length (cm)"
            type="number"
            step="0.1"
            name="length"
            value={formData.length}
            onChange={handleChange}
            required
            placeholder="30"
          />
          <Input
            label="Width (cm)"
            type="number"
            step="0.1"
            name="width"
            value={formData.width}
            onChange={handleChange}
            required
            placeholder="20"
          />
          <Input
            label="Height (cm)"
            type="number"
            step="0.1"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
            placeholder="15"
          />
          <Input
            label="Package Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Fragile electronics, documents, etc."
            className="md:col-span-4"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
        <Button type="submit" disabled={isLoading} className="px-8">
          {isLoading ? "Booking Shipment..." : "Book Shipment"}
        </Button>
      </div>
    </form>
  );
}
