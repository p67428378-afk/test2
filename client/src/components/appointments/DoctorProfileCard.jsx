import React from "react";

export default function DoctorProfileCard({ doctor, selectedSlot, onBook }) {
  if (!doctor) {
    return (
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-unit-lg flex flex-col h-full justify-center items-center text-on-surface-variant">
        <span class="material-symbols-outlined text-4xl mb-2">
          person_search
        </span>
        <p class="text-body-md">Select a doctor to view profile</p>
      </div>
    );
  }

  // Format selected slot for display
  const formatSlotDisplay = (slotIso) => {
    if (!slotIso) return "None selected";
    const date = new Date(slotIso);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-unit-lg flex flex-col h-full">
      <div class="flex items-center gap-4 mb-6">
        <img
          alt={doctor.name}
          class="w-20 h-20 rounded-full object-cover border-2 border-surface-variant"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHBxJGug4ZNhtvgEyajXFMLfcyHUtNIoC4nHltOZG9ZPcdVqMmlVAeWJfhxZPfwxUrTbVPKUC2NR7gkxXDESSRdESOuTKpAeH25zealXvyu8HtB6CI5m8-nj3oUMKXTZyzrINBaFPBjXJvb2Ype55u01HbqPImU0gkhlsuXiv554MLxh-Q2iRWMvQZ9cNWIyrFerflS1i5WmkIqyyOjMWTFvBLi5hE_MbIoqMXTD4I-QnqVKXS9HlJjmoGurtnS2ZqSP94oYFlxPt3"
        />
        <div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">
            {doctor.name}
          </h3>
          <p class="text-body-sm font-body-sm text-on-surface-variant">
            {doctor.specialty}
          </p>
          <div class="flex items-center gap-1 mt-1 text-amber-500">
            <span
              class="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span class="font-label-sm text-label-sm text-on-surface">
              4.9 (120 reviews)
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-surface-variant/30 p-3 rounded-lg text-center">
          <div class="font-label-lg text-label-lg text-on-surface">15+ Yrs</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant">
            Experience
          </div>
        </div>
        <div class="bg-surface-variant/30 p-3 rounded-lg text-center">
          <div class="font-label-lg text-label-lg text-on-surface">98%</div>
          <div class="font-label-sm text-label-sm text-on-surface-variant">
            Satisfaction
          </div>
        </div>
      </div>

      <div class="mt-auto border-t border-outline-variant pt-6">
        <p class="font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
          Selected Slot
        </p>
        <p class="font-body-md text-body-md text-on-surface font-semibold mb-4">
          {selectedSlot
            ? formatSlotDisplay(selectedSlot.iso)
            : "Please select a time slot from the calendar"}
        </p>
        <button
          onClick={onBook}
          disabled={!selectedSlot}
          class={`w-full font-label-lg text-label-lg py-3 rounded-lg transition-colors duration-200 flex justify-center items-center gap-2 shadow-sm ${
            selectedSlot
              ? "bg-[#0D9488] hover:bg-[#0F766E] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span class="material-symbols-outlined">calendar_today</span>
          Book Consultation Slot
        </button>
      </div>
    </div>
  );
}
