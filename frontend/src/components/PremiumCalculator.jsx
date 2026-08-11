import React, { useState } from 'react'

const PremiumCalculator = () => {
  const [baseRate, setBaseRate] = useState(500) // Default from requirement
  const [noClaimsYears, setNoClaimsYears] = useState(0)
  const [vehicleType, setVehicleType] = useState('Economy')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const vehicleTypes = ['Economy', 'Standard', 'Sport', 'Luxury']

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/v1/premium/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_rate: parseFloat(baseRate),
          no_claims_years: parseInt(noClaimsYears),
          vehicle_type: vehicleType,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Something went wrong')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white shadow-md rounded-lg p-8 max-w-md w-full'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Premium Calculator</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='baseRate' className='block text-sm font-medium text-gray-700'>Base Rate ($)</label>
          <input
            type='number'
            id='baseRate'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            value={baseRate}
            onChange={(e) => setBaseRate(e.target.value)}
            required
            min='1'
          />
        </div>
        <div>
          <label htmlFor='noClaimsYears' className='block text-sm font-medium text-gray-700'>No Claims Years</label>
          <input
            type='number'
            id='noClaimsYears'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            value={noClaimsYears}
            onChange={(e) => setNoClaimsYears(e.target.value)}
            required
            min='0'
            max='10'
          />
        </div>
        <div>
          <label htmlFor='vehicleType' className='block text-sm font-medium text-gray-700'>Vehicle Type</label>
          <select
            id='vehicleType'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          >
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Calculate Premium'}
        </button>
      </form>

      {error && (
        <div className='mt-6 p-3 bg-red-100 text-red-700 rounded-md'>
          <p className='font-medium'>Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className='mt-6 p-4 bg-green-100 text-green-800 rounded-md'>
          <h3 className='text-lg font-semibold mb-2'>Calculation Result:</h3>
          <p><strong>Calculated Premium:</strong> ${result.calculated_premium.toFixed(2)}</p>
          <p><strong>NCB Discount:</strong> {(result.ncb_discount_percentage * 100).toFixed(0)}%</p>
          <p><strong>Vehicle Multiplier:</strong> {result.vehicle_multiplier.toFixed(1)}x</p>
        </div>
      )}
    </div>
  )
}

export default PremiumCalculator
