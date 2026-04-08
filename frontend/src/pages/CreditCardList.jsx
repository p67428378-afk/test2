import React from 'react';

function CreditCardList() {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>Available Credit Cards</h2>
      <p>List of credit cards will be displayed here.</p>
      {/* Placeholder for credit card listings */}
      <div className='mt-4 p-4 border rounded-md bg-gray-50'>
        <h3 className='text-lg font-medium'>Card A</h3>
        <p>Features: Low interest, rewards points</p>
        <p>Eligibility: Good credit score</p>
      </div>
      <div className='mt-4 p-4 border rounded-md bg-gray-50'>
        <h3 className='text-lg font-medium'>Card B</h3>
        <p>Features: Travel benefits, no annual fee</p>
        <p>Eligibility: Excellent credit score</p>
      </div>
    </div>
  );
}

export default CreditCardList;
