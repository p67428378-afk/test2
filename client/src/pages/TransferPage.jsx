import React from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import TransferForm from '../components/Transfers/TransferForm';

const TransferPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Fund Transfer</h2>
            <div className="max-w-2xl mx-auto">
              <TransferForm />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TransferPage;
