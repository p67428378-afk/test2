import React from 'react';
import Header from '../components/Header';

const CancelPolicy = () => {
  return (
    <div className="bg-background text-on-surface min-h-screen pb-32">
      <Header />
      <main className="pt-28 px-6 max-w-4xl mx-auto">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full mb-6">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <span className="text-xs font-bold uppercase tracking-widest font-label">Urgent Notice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tight leading-tight">
            Loss of Coverage
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Cancelling your policy will leave you unprotected from unforeseen medical expenses and may affect your eligibility for future rates.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-surface-container-lowest rounded-3xl p-8 shadow-[0_12px_32px_rgba(0,72,141,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100%]"></div>
            <div className="relative z-10">
              <span className="text-primary font-semibold text-sm uppercase tracking-widest block mb-2">Active Plan</span>
              <h2 className="text-2xl font-bold text-on-surface mb-6">Premium Care Plan #7742</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary">medical_information</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Coverage Level</p>
                    <p className="text-on-surface font-bold">Comprehensive Medical &amp; Dental</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary">event_available</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Policy Since</p>
                    <p className="text-on-surface font-bold">January 12, 2021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-container rounded-3xl p-8 text-white flex flex-col justify-between shadow-[0_20px_40px_rgba(0,72,141,0.15)]">
            <div>
              <span className="text-on-primary-container/80 text-sm font-semibold uppercase tracking-widest block mb-1">Prorated Refund</span>
              <div className="text-5xl font-extrabold tracking-tight mb-2">$142.50</div>
              <p className="text-sm text-on-primary-container leading-snug opacity-90">
                Calculated based on your remaining coverage days for this billing cycle.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="text-xs font-medium italic">Processing takes 3-5 business days.</span>
            </div>
          </div>
          <div className="md:col-span-5 bg-surface-container-low rounded-3xl p-10 mt-2">
            <h3 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
              Terms of Termination
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-on-surface/10 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-sm">close</span>
                </div>
                <div>
                  <p className="text-on-surface font-bold mb-2">Immediate Cessation</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Claims submitted after 11:59 PM today will not be processed under this policy.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-on-surface/10 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                </div>
                <div>
                  <p className="text-on-surface font-bold mb-2">30-Day Grace Period</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Emergency access to digital health records remains active for 30 days post-cancellation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-6 h-6 rounded-full bg-on-surface/10 flex items-center justify-center mt-1">
                  <span className="material-symbols-outlined text-sm">assignment_late</span>
                </div>
                <div>
                  <p className="text-on-surface font-bold mb-2">Re-enrollment Policy</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Future re-enrollment may require a fresh health assessment and adjusted premium rates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col md:flex-row-reverse items-center justify-center gap-6">
          <button className="w-full md:w-auto px-12 py-4 bg-surface-container-highest text-on-secondary-container font-bold rounded-full hover:bg-surface-variant active:scale-95 transition-all duration-200">
            Confirm Cancellation
          </button>
          <button className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all duration-200">
            Keep My Policy
          </button>
        </div>
        <p className="text-center mt-12 text-on-surface-variant text-xs">
          Need help deciding? <a className="text-primary font-bold hover:underline" href="#">Speak with a Policy Specialist</a>
        </p>
      </main>
    </div>
  );
};

export default CancelPolicy;
