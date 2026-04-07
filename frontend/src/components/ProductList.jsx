import React from 'react';

function ProductList({ products, onApplyClick }) {
  return (
    <div className='p-4'>
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>Available Credit Card Products</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {products.map((product) => (
          <div key={product.product_id} className='bg-white rounded-lg shadow-lg p-6 border border-gray-200'>
            <h3 className='text-2xl font-semibold text-blue-700 mb-2'>{product.name}</h3>
            <p className='text-gray-600 mb-4'>{product.description}</p>
            <div className='space-y-2 text-gray-700'>
              <p><span className='font-medium'>APR:</span> {product.apr}%</p>
              <p><span className='font-medium'>Annual Charges:</span> ${product.annual_charges.toFixed(2)}</p>
              <p><span className='font-medium'>Credit Limit:</span> ${product.credit_limit_min.toFixed(2)} - ${product.credit_limit_max.toFixed(2)}</p>
              <p><span className='font-medium'>Rewards:</span> {product.rewards_description}</p>
            </div>
            <button
              onClick={() => onApplyClick(product)}
              className='mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105'
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <p className='text-center text-gray-500 text-lg mt-8'>No credit card products available at the moment. Please check back later.</p>
      )}
    </div>
  );
}

export default ProductList;
