
import React from 'react';
import CardBlockForm from './components/CardBlockForm';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-background text-on-background font-body antialiased">
      <Header />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 w-full p-12 bg-surface">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-1">
              <p className="text-xs font-label uppercase tracking-widest text-outline">Terminal / Security / Protocol</p>
              <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Access Control Protocol</h1>
            </div>
            <CardBlockForm />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
