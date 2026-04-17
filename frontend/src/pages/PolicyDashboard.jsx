import React from 'react';
import Header from '../components/Header';
import DeductibleProgress from '../components/DeductibleProgress';
import CoverageCard from '../components/CoverageCard';
import BottomNavBar from '../components/BottomNavBar';

const PolicyDashboard = () => {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <section className="relative mb-12">
          <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary to-primary-container p-8 md:p-12 text-white shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-end">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label text-xs font-semibold uppercase tracking-widest">Active Coverage</span>
                </div>
                <h2 className="font-headline font-extrabold text-4xl md:text-5xl mb-2 tracking-tight">Gold Plan</h2>
                <p className="text-primary-fixed text-lg opacity-90 font-medium">Effective since Jan 1, 2024</p>
              </div>
              <div className="flex flex-col md:items-end">
                <div className="text-right">
                  <p className="text-primary-fixed/80 text-sm font-label uppercase tracking-wider mb-1">Monthly Premium</p>
                  <p className="text-3xl font-headline font-bold">$300.00</p>
                </div>
              </div>
            </div>
          </div>
          <DeductibleProgress />
        </section>

        <section className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <CoverageCard icon="medical_services" title="Medical" description="Comprehensive health coverage with access to our elite network of providers." benefit="Full In-Network" />
          <CoverageCard icon="dentistry" title="Dental" description="Restorative and preventative care including bi-annual cleanings and imaging." benefit="Tier 1 Benefits" />
          <CoverageCard icon="visibility" title="Vision" description="Complete visual health maintenance including hardware allowance." benefit="Annual Checkup" />
        </section>

        <section className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-surface-container-low">
          <div>
            <h3 className="font-headline font-bold text-lg mb-1">Policy Management</h3>
            <p className="text-on-surface-variant text-sm">Make changes to your plan or coverage dates.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-primary-container text-white active:scale-95 transition-all shadow-lg shadow-primary/20">
              Update Policy
            </button>
            <button className="flex-1 md:flex-none px-8 py-4 rounded-xl font-bold text-tertiary hover:bg-tertiary-fixed/20 transition-colors active:scale-95">
              Cancel Policy
            </button>
          </div>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
};

export default PolicyDashboard;
