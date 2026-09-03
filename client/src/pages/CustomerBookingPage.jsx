import React, { useState, useEffect } from "react";
import HoldBanner from "../components/common/HoldBanner";
import PackageSelector from "../components/booking/PackageSelector";
import AddonCheckboxGroup from "../components/booking/AddonCheckboxGroup";
import DepositPaymentForm from "../components/booking/DepositPaymentForm";
import {
  packageService,
  photographerService,
  sessionService,
  paymentService,
} from "../services/api";
import { Calendar, Clock, User, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerBookingPage() {
  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [bookingDate, setBookingDate] = useState("2026-06-20");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("14:00");
  const [eventNotes, setEventNotes] = useState(
    "Outdoor portrait shoot in studio garden.",
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successBooking, setSuccessBooking] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [pkgs, addns, photogs] = await Promise.all([
        packageService.getPackages().catch(() => []),
        packageService.getAddons().catch(() => []),
        photographerService.getPhotographers().catch(() => []),
      ]);

      setPackages(pkgs);
      setAddons(addns);
      setPhotographers(photogs);

      if (pkgs.length > 0) setSelectedPackage(pkgs[0]);
      if (photogs.length > 0) {
        setSelectedPhotographer(photogs[0]);
        fetchSlots(photogs[0].id, bookingDate);
      }
    } catch (err) {
      console.error("Error fetching booking options:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlots = async (photographerId, dateStr) => {
    if (!photographerId) return;
    try {
      const slots = await photographerService.getSlots(photographerId, dateStr);
      setAvailableSlots(slots);
      const firstAvailable = slots.find((s) => s.is_available);
      if (firstAvailable) setSelectedSlot(firstAvailable.start_time);
    } catch (err) {
      console.warn("Could not fetch slot availability:", err);
    }
  };

  const handlePhotographerChange = (pId) => {
    const p = photographers.find((item) => item.id === pId);
    setSelectedPhotographer(p);
    fetchSlots(pId, bookingDate);
  };

  const handleDateChange = (dateVal) => {
    setBookingDate(dateVal);
    if (selectedPhotographer) fetchSlots(selectedPhotographer.id, dateVal);
  };

  const handleToggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Price Calculation
  const basePrice = selectedPackage?.price || 1200.0;
  const addonsTotal = selectedAddons.reduce(
    (sum, a) => sum + (a.price || 0),
    0,
  );
  const totalPrice = basePrice + addonsTotal;

  const handleDepositSubmit = async (paymentData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessBooking(null);

    try {
      // 1. Create session
      const startTimeIso = `${bookingDate}T${selectedSlot}:00Z`;
      const sessionPayload = {
        photographer_id:
          selectedPhotographer?.id || "00000000-0000-0000-0000-000000000000",
        package_id:
          selectedPackage?.id || "00000000-0000-0000-0000-000000000000",
        start_time: startTimeIso,
        event_notes: eventNotes,
        add_on_ids: selectedAddons.map((a) => a.id),
      };

      const sessionRes = await sessionService.bookSession(sessionPayload);

      // 2. Process Deposit Payment
      const paymentPayload = {
        session_id: sessionRes.id,
        amount: paymentData.amount,
        payment_method: paymentData.payment_method || "credit_card",
        transaction_reference: paymentData.transaction_reference,
      };

      const paymentRes = await paymentService.processPayment(paymentPayload);

      setSuccessBooking({
        session: sessionRes,
        payment: paymentRes,
      });
    } catch (err) {
      console.error("Booking error:", err);
      const msg =
        err.response?.data?.detail ||
        "Failed to complete session booking. Please check slot availability.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 15-Minute Slot Hold Active Banner */}
      <HoldBanner
        selectedSlotDate={`${bookingDate} @ ${selectedSlot}`}
        holdExpiresAt={new Date(Date.now() + 15 * 60 * 1000).toISOString()}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Book Your Photography Session
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Select a package, customize add-ons, choose your preferred
          photographer and slot, and confirm with a 50% deposit.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl mb-6 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successBooking ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center max-w-2xl mx-auto my-8 shadow-md">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-emerald-950 mb-2">
            Reservation Confirmed!
          </h2>
          <p className="text-sm text-emerald-800 mb-6">
            Your 50% booking deposit was successfully processed. Session ID:{" "}
            <strong className="font-mono">{successBooking.session.id}</strong>.
          </p>
          <div className="bg-white p-4 rounded-xl border border-emerald-100 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-stone-500">Package:</span>
              <span className="font-bold">{selectedPackage?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Date & Time:</span>
              <span className="font-bold">
                {bookingDate} @ {selectedSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Deposit Paid:</span>
              <span className="font-bold text-emerald-700">
                ${(totalPrice * 0.5).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Status:</span>
              <span className="font-bold capitalize text-amber-800">
                {successBooking.payment?.session_status || "Partial"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSuccessBooking(null)}
            className="px-6 py-2.5 bg-[#775A19] text-white font-bold text-sm rounded-xl hover:bg-[#5f4613] transition-colors"
          >
            Book Another Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Package, Addons, Photographer, Slot selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <PackageSelector
                packages={packages}
                selectedPackage={selectedPackage}
                onSelectPackage={setSelectedPackage}
              />

              <AddonCheckboxGroup
                addons={addons}
                selectedAddons={selectedAddons}
                onToggleAddon={handleToggleAddon}
              />
            </div>

            {/* Photographer & Time Slot Selection */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                <User className="w-5 h-5 text-[#C5A059]" />
                Select Photographer & Date
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Photographer
                  </label>
                  <select
                    value={selectedPhotographer?.id || ""}
                    onChange={(e) => handlePhotographerChange(e.target.value)}
                    className="w-full border border-stone-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  >
                    {photographers.length > 0 ? (
                      photographers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.full_name ||
                            p.bio ||
                            `Photographer ${p.id.slice(0, 6)}`}
                        </option>
                      ))
                    ) : (
                      <option value="default-elena">
                        Elena Rostova (Portrait & Wedding Specialist)
                      </option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full border border-stone-300 p-2.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {["09:00", "11:00", "14:00", "16:00"].map((time) => {
                    const isSelected = selectedSlot === time;
                    return (
                      <button
                        type="button"
                        key={time}
                        onClick={() => setSelectedSlot(time)}
                        className={`p-2.5 text-xs font-bold rounded-lg border transition-all ${
                          isSelected
                            ? "bg-[#C5A059] text-white border-[#C5A059] shadow-sm"
                            : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Event Notes & Requests
                </label>
                <textarea
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  rows={2}
                  className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                  placeholder="Share details regarding location, color palette, or specific shots..."
                />
              </div>
            </div>
          </div>

          {/* Right Column: Checkout & Deposit Summary */}
          <div>
            <DepositPaymentForm
              totalPrice={totalPrice}
              onSubmitDeposit={handleDepositSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
