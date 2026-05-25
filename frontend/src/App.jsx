import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import ApplicationForm from './components/ApplicationForm';
import ApplicationStatus from './components/ApplicationStatus';
import * as api from './api';

function App() {
  const [view, setView] = useState('products'); // 'products', 'apply', 'status'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleApplyClick = (product) => {
    setSelectedProduct(product);
    setView('apply');
  };

  const handleApplicationSubmit = (appId) => {
    setApplicationId(appId);
    setView('status');
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <nav className='bg-blue-600 p-4 text-white shadow-md'>
        <div className='container mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>Credit Card Management</h1>
          <div>
            <button
              onClick={() => setView('products')}
              className='mr-4 hover:text-blue-200'
            >
              Products
            </button>
            <button
              onClick={() => setView('apply')}
              className='mr-4 hover:text-blue-200'
            >
              Apply
            </button>
            <button
              onClick={() => setView('status')}
              className='hover:text-blue-200'
            >
              Status
            </button>
          </div>
        </div>
      </nav>

      <main className='container mx-auto p-4'>
        {view === 'products' && (
          <ProductList products={products} onApplyClick={handleApplyClick} />
        )}
        {view === 'apply' && (
          <ApplicationForm
            product={selectedProduct}
            onSubmitSuccess={handleApplicationSubmit}
            onBack={() => setView('products')}
          />
        )}
        {view === 'status' && (
          <ApplicationStatus
            applicationId={applicationId}
            onBack={() => setView('products')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
