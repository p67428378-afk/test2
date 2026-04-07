import React, { useEffect, useState } from 'react';
import { getProducts } from '../api';

function ProductList({ onApplyClick }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className='text-center text-gray-600'>Loading products...</div>;
  }

  if (error) {
    return <div className='text-center text-red-600'>Error: {error}</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {products.map((product) => (
        <div key={product.product_id} className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
          <h2 className='text-xl font-semibold text-blue-800 mb-2'>{product.name}</h2>
          <p className='text-gray-700 mb-4'>{product.description}</p>
          <div className='space-y-1 text-sm text-gray-600'>
            <p><strong>APR:</strong> {product.apr}%</p>
            <p><strong>Annual Charges:</strong> ${product.annual_charges.toFixed(2)}</p>
            <p><strong>Credit Limit:</strong> ${product.credit_limit_min.toFixed(2)} - ${product.credit_limit_max.toFixed(2)}</p>
            <p><strong>Rewards:</strong> {product.rewards_description}</p>
          </div>
          <button
            onClick={() => onApplyClick(product)}
            className='mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          >
            Apply Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
