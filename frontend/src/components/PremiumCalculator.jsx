import React, { useState } from 'react'

const PremiumCalculator = () => {
  const [baseRate, setBaseRate] = useState(500);
  const [ncbTier, setNcbTier] = useState('No NCB');
  const [vehicleMultiplier, setVehicleMultiplier] = useState(1.0);
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [calculatedPremium, setCalculatedPremium] = useState(null);
  const [policyDetails, setPolicyDetails] = useState(null);
  const [error, setError] = useState(null);

  const ncbOptions = [
    'No NCB',
    'Tier 1',
    'Tier 2',
    'Tier 3',
    'Tier 4',
    'Tier 5',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCalculatedPremium(null);
    setPolicyDetails(null);

    try {
      const response = await fetch('/api/v1/insurance/premium/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseRate: parseFloat(baseRate),
          ncbTier,
          vehicleMultiplier: parseFloat(vehicleMultiplier),
          vehicleDetails: vehicleMake || vehicleModel || vehicleYear ? { make: vehicleMake, model: vehicleModel, year: parseInt(vehicleYear) } : undefined,
          customerDetails: customerName || customerEmail ? { name: customerName, email: customerEmail } : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Something went wrong');
      }

      const data = await response.json();
      setCalculatedPremium(data.premium);
      setPolicyDetails({
        baseRate: parseFloat(baseRate),
        ncbTier,
        vehicleMultiplier: parseFloat(vehicleMultiplier),
        vehicleDetails: vehicleMake || vehicleModel || vehicleYear ? { make: vehicleMake, model: vehicleModel, year: parseInt(vehicleYear) } : null,
        customerDetails: customerName || customerEmail ? { name: customerName, email: customerEmail } : null,
        policyId: data.policyId,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-2xl'>
      <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>Calculate Your Premium</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='baseRate' className='block text-sm font-medium text-gray-700'>Base Rate ($)</label>
          <input
            type='number'
            id='baseRate'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            required
            min='1'
          />
        </div>

        <div>
          <label htmlFor='ncbTier' className='block text-sm font-medium text-gray-700'>No Claim Bonus (NCB)</label>
          <select
            id='ncbTier'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
            value={ncbTier}
            onChange={(e) => setNcbTier(e.target.value)}
            required
          >
            {ncbOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor='vehicleMultiplier' className='block text-sm font-medium text-gray-700'>Vehicle Multiplier</label>
          <input
            type='number'
            id='vehicleMultiplier'
            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
            value={vehicleMultiplier}
            onChange={(e) => setVehicleMultiplier(e.target.value)}
            required
            step='0.1'
            min='0.8'
            max='1.6'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label htmlFor='vehicleMake' className='block text-sm font-medium text-gray-700'>Vehicle Make</label>
            <input
              type='text'
              id='vehicleMake'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='vehicleModel' className='block text-sm font-medium text-gray-700'>Vehicle Model</label>
            <input
              type='text'
              id='vehicleModel'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='vehicleYear' className='block text-sm font-medium text-gray-700'>Vehicle Year</label>
            <input
              type='number'
              id='vehicleYear'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              min='1900'
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor='customerName' className='block text-sm font-medium text-gray-700'>Customer Name</label>
            <input
              type='text'
              id='customerName'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='customerEmail' className='block text-sm font-medium text-gray-700'>Customer Email</label>
            <input
              type='email'
              id='customerEmail'
              className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
        </div>

        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Calculate Premium
        </button>
      </form>

      {error && (
        <div className='mt-6 p-4 bg-red-100 text-red-700 rounded-md'>
          Error: {error}
        </div>
      )}

      {calculatedPremium !== null && (
        <div className='mt-6 p-6 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>Your Estimated Premium</h2>
          <p className='text-2xl font-bold mb-4'>Calculated Premium: ${calculatedPremium.toFixed(2)}</p>
          {policyDetails && (
            <div>
              <h3 className='text-lg font-medium mb-2'>Policy Details:</h3>
              <ul className='list-disc list-inside space-y-1'>
                <li>Policy ID: {policyDetails.policyId}</li>
                <li>Base Rate: ${policyDetails.baseRate.toFixed(2)}</li>
                <li>NCB Applied: {policyDetails.ncbTier}</li>
                <li>Vehicle Multiplier: {policyDetails.vehicleMultiplier.toFixed(1)}x</li>
                {policyDetails.vehicleDetails && (
                  <li>Vehicle: {policyDetails.vehicleDetails.make} {policyDetails.vehicleDetails.model} ({policyDetails.vehicleDetails.year})</li>
                )}
                {policyDetails.customerDetails && (
                  <li>Customer: {policyDetails.customerDetails.name} ({policyDetails.customerDetails.email})</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumCalculator;
