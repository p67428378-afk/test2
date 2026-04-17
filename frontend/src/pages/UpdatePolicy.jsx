import React from 'react';
import Header from '../components/Header';

const UpdatePolicy = () => {
  return (
    <div className="text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Header />
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-primary font-bold tracking-widest text-xs uppercase font-label">Account Security</span>
            <h1 className="text-5xl font-extrabold text-on-surface leading-tight tracking-tighter">Maintain your <br/><span className="text-primary-container">coverage accuracy.</span></h1>
            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
              Keeping your mailing address current ensures you receive critical policy updates, tax documents, and physical reimbursement checks without delay.
            </p>
            <div className="bg-surface-container-high/50 p-6 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>
              <div className="flex items-center gap-3 text-tertiary">
                <span className="material-symbols-outlined">info</span>
                <span className="font-bold text-sm uppercase tracking-wide">Verification Notice</span>
              </div>
              <p className="text-on-surface-variant text-sm font-medium">
                Address changes require 24-48 hours for verification. Our administrative team reviews all residential shifts to ensure compliance with regional insurance regulations.
              </p>
            </div>
            <div className="hidden lg:block pt-8">
              <img alt="Abstract medical glass" className="rounded-xl opacity-40 grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNJtXK4I-NbG3uvlE0KOXibqLh3PG5E7UiAT9YxaQylctVJwiQaBAQqaks1bOgKdx0EfS4kQi4TUMyJAsVJuuAuAeKsW_1If__66vez7bTx2GvtA435W00lxz_TTegiOu8I-CUNnVnxin-PxOvbSBzOFqB_BYTBUSxUcG00q3N0eVYdspWWabu9Eu_WLkwsmg6ehtlUV0p0yuuxOlyzjKJI_btnn9D1vSJyiijZ2jNM90oPgVprcpwQ_RmM8I0ShVOJOsYIji0Czs"/>
            </div>
          </div>
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-full p-10 custom-shadow">
            <form className="space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Street Address</label>
                  <input className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant" placeholder="e.g. 123 Sanctuary Way, Apt 4B" type="text"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">City</label>
                    <input className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant" placeholder="Metropolis" type="text"/>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">State</label>
                    <div className="relative">
                      <select className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300">
                        <option value="">Select State</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="group max-w-xs">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">Zip Code</label>
                  <input className="w-full bg-surface-container-high border-none rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 placeholder:text-outline-variant" placeholder="00000" type="text"/>
                </div>
              </div>
              <div className="pt-6 border-t-4 border-surface-container-high">
                <button className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg shadow-primary/10" type="submit">
                  Submit Request
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <p className="mt-4 text-xs text-on-surface-variant font-medium">
                  By submitting, you confirm this is your legal place of residence for policy documentation.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdatePolicy;
