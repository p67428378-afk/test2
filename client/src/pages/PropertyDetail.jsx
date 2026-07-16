import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyService, messageService } from "../services/api";

export default function PropertyDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.get(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
        setError("Property not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMessageSuccess("");
    setMessageError("");

    if (!user) {
      setMessageError("You must be logged in to contact the broker.");
      return;
    }

    if (!messageContent.trim()) {
      setMessageError("Message content cannot be empty.");
      return;
    }

    try {
      await messageService.send({
        content: messageContent,
        property_id: property.id,
        receiver_id: property.broker.id,
      });
      setMessageSuccess("Message sent successfully!");
      setMessageContent("");
    } catch (err) {
      console.error(err);
      setMessageError("Failed to send message.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-[#bbcabf]">
        <span className="material-symbols-outlined animate-spin mr-2">
          sync
        </span>
        Loading property details...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-[#ffb4ab] mb-2">
          error
        </span>
        <p className="text-sm text-[#ffb4ab]">
          {error || "Property not found."}
        </p>
        <button
          onClick={() => navigate("/buyer-portal")}
          className="mt-4 bg-[#10b981] text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-[#4edea3] transition-colors"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[#bbcabf] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Back
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Details (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Image */}
          <div className="h-96 bg-[#0f172a] rounded-xl overflow-hidden relative">
            {property.images?.[0] ? (
              <img
                src={property.images[0]}
                alt={property.address}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#bbcabf] gap-2">
                <span className="material-symbols-outlined text-5xl">
                  image
                </span>
                <span>No Image Available</span>
              </div>
            )}
            <span
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold border ${
                property.status === "ACTIVE"
                  ? "bg-[#10B981]/80 text-[#0F172A] border-[#10B981]"
                  : property.status === "PENDING"
                    ? "bg-[#FBBF24]/80 text-[#0F172A] border-[#FBBF24]"
                    : "bg-[#EF4444]/80 text-white border-[#EF4444]"
              }`}
            >
              {property.status}
            </span>
          </div>

          {/* Title & Price */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {property.address}
              </h2>
              <p className="text-sm text-[#bbcabf] mt-1 capitalize">
                {property.property_type}
              </p>
            </div>
            <span className="text-3xl font-bold text-[#4edea3]">
              ${Number(property.price).toLocaleString()}
            </span>
          </div>

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-4 bg-[#1E293B] border border-[#334155] rounded-xl p-4 text-center">
            <div>
              <p className="text-xs text-[#bbcabf]">Bedrooms</p>
              <p className="text-xl font-bold text-white mt-1">
                {property.bedrooms}
              </p>
            </div>
            <div className="border-x border-[#334155]">
              <p className="text-xs text-[#bbcabf]">Bathrooms</p>
              <p className="text-xl font-bold text-white mt-1">
                {property.bathrooms}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#bbcabf]">Property Type</p>
              <p className="text-xl font-bold text-white mt-1 capitalize">
                {property.property_type}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-white">Description</h3>
            <p className="text-sm text-[#bbcabf] leading-relaxed">
              {property.description ||
                "No description provided for this property."}
            </p>
          </div>
        </div>

        {/* Right Column: Broker Info & Contact Form (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Broker Card */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Listed By
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2d3449] flex items-center justify-center text-[#4edea3] font-bold text-lg">
                {property.broker?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-white">
                  {property.broker?.full_name}
                </h4>
                <p className="text-xs text-[#bbcabf]">
                  {property.broker?.broker_agency || "Independent Broker"}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs text-[#bbcabf] pt-4 border-t border-[#334155]/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">
                  mail
                </span>
                <span>{property.broker?.email}</span>
              </div>
              {property.broker?.phone && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">
                    phone
                  </span>
                  <span>{property.broker.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Inquire About Property
            </h3>

            {messageSuccess && (
              <div className="bg-[#10b981]/10 border border-[#10b981]/30 text-[#4edea3] p-3 rounded-lg text-xs">
                {messageSuccess}
              </div>
            )}
            {messageError && (
              <div className="bg-red-500/10 border border-red-500/30 text-[#ffb4ab] p-3 rounded-lg text-xs">
                {messageError}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-[#94A3B8] mb-1">
                  Your Message
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="I am interested in this property. Please contact me."
                  className="w-full rounded-lg text-sm px-3 py-2 bg-[#0f172a] border border-[#334155] text-white resize-none"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#10b981] text-[#0F172A] font-bold py-2 rounded-lg hover:bg-[#4edea3] transition-colors text-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
