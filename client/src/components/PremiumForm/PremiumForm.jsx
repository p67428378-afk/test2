import React, { useState } from 'react';
import PolicyHolderDetails from './PolicyHolderDetails';
import VehicleDetails from './VehicleDetails';
import NCBHistoryInput from './NCBHistoryInput';

const PremiumForm = ({ onCalculate }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        drivingExperience: '',
        make: '',
        model: '',
        year: '',
        engineSize: '',
        safetyFeatures: {
            abs: true,
            airbags: true,
            laneAssist: false,
            parkingSensors: false,
        },
        ncb_years: '',
        vehicle_value: 50000, // Example value, should be dynamic
        vehicle_type_multiplier: 1.2 // Example value, should be dynamic
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            safetyFeatures: { ...prev.safetyFeatures, [name]: checked }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation and formatting before passing to parent
        const calculationData = {
            vehicle_value: parseFloat(formData.vehicle_value),
            ncb_years: parseInt(formData.ncb_years, 10),
            vehicle_type_multiplier: parseFloat(formData.vehicle_type_multiplier),
        };
        onCalculate(calculationData);
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
