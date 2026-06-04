import React, { useState } from 'react';
import PolicyHolderDetails from './PolicyHolderDetails';
import VehicleDetails from './VehicleDetails';
import NCBHistoryInput from './NCBHistoryInput';
import { calculatePremium } from '../../services/api';

const PremiumForm = ({ setPremiumData, setUserDetails }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    drivingExperience: '',
    make: '',
    model: '',
    year: '',
    engineSize: '',
    safetyFeatures: ['ABS', 'Airbags'],
    ncbYears: '',
    vehicle_value: 50000, // Hardcoded for now
    vehicle_type_multiplier: 1.2 // Hardcoded for now
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => {
      const newSafetyFeatures = checked
        ? [...prevState.safetyFeatures, value]
        : prevState.safetyFeatures.filter(feature => feature !== value);
      return { ...prevState, safetyFeatures: newSafetyFeatures };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiData = {
        vehicle_value: parseFloat(formData.vehicle_value),
        ncb_years: parseInt(formData.ncbYears, 10),
        vehicle_type_multiplier: parseFloat(formData.vehicle_type_multiplier),
      };
      const data = await calculatePremium(apiData);
      setPremiumData(data);
      setUserDetails(formData);
    } catch (error) {
      console.error("Failed to calculate premium", error);
      // You might want to show an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col gap-xl">
      <PolicyHolderDetails formData={formData} handleChange={handleChange} />
      <VehicleDetails formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />
      <NCBHistoryInput formData={formData} handleChange={handleChange} />
      <div className="pt-lg flex justify-center">
        <button type="submit" className="bg-[#3B82F6] text-white px-[48px] py-[16px] rounded-lg font-headline-md text-headline-md shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all w-full md:w-auto">
          Calculate Premium
        </button>
      </div>
    </form>
  );
};

export default PremiumForm;
