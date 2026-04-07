import React, { useState } from 'react';
import ProductList from './components/ProductList';
import ApplicationForm from './components/ApplicationForm';
import ApplicationStatus from './components/ApplicationStatus';

function App() {
  const [view, setView] = useState('products'); // 'products', 'apply', 'status'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [applicationId, setApplicationId] = useState(null);

  const handleApplyClick = (product) => {
    setSelectedProduct(product);
    setView('apply');
  };

  const handleApplicationSubmit = (appId) => {
    setApplicationId(appId);
    setView('status');
  };

  return (
    <div className='min-h-screen bg-gray-100 font-sans'>
      <nav className='bg-blue-600 p-4 text-white shadow-md'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Credit Card Application Portal</h1>
          <div>
            <button
              onClick={() => setView('products')}
              className={`mr-4 px-3 py-2 rounded ${view === 'products' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              View Products
            </button>
            <button
              onClick={() => setView('apply')}
              className={`mr-4 px-3 py-2 rounded ${view === 'apply' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              Apply Now
            </button>
            <button
              onClick={() => setView('status')}
              className={`px-3 py-2 rounded ${view === 'status' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
            >
              Track Status
            </button>
          </div>
        </div>
      </nav>

      <main className='container mx-auto mt-8 p-4'>
        {view === 'products' && <ProductList onApplyClick={handleApplyClick} />}
        {view === 'apply' && (
          <ApplicationForm
            product={selectedProduct}
            onSubmitSuccess={handleApplicationSubmit}
            onBack={() => setView('products')}
          />
        )}
        {view === 'status' && <ApplicationStatus initialApplicationId={applicationId} />}
      </main>
    </div>
  );
}

export default App;
