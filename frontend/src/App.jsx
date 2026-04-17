
import React from 'react';
import Header from './components/Header';
import PolicyDetails from './components/PolicyDetails';
import ManagePolicy from './components/ManagePolicy';
import CancelPolicy from './components/CancelPolicy';

function App() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Header />
      <main className="pt-24 pb-12 px-8 max-w-[1920px] mx-auto">
        <section className="mb-12">
          <h1 className="text-display-lg text-5xl font-extrabold text-on-surface tracking-tight mb-2">My Policy.</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">Manage your coverage details, update beneficiaries, or adjust your healthcare journey settings from your clinical sanctuary.</p>
        </section>
        <div className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar scroll-smooth">
          <PolicyDetails />
          <ManagePolicy />
          <CancelPolicy />
        </div>
      </main>
    </div>
  );
}

export default App;
