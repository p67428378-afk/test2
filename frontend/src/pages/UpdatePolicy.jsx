import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPolicy, updatePolicy } from '../services/policyService';

const UpdatePolicy = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        plan_type: '',
        premium_amount: '',
        status: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        getPolicy(policyId)
            .then(data => {
                setFormData({
                    plan_type: data.plan_type,
                    premium_amount: data.premium_amount,
                    status: data.status,
                });
            })
            .catch(err => {
                console.error("Failed to fetch policy details:", err);
                setError("Failed to load policy data. Please try again later.");
            });
    }, [policyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const policyData = {
                ...formData,
                premium_amount: parseFloat(formData.premium_amount)
            };
            const updated = await updatePolicy(policyId, policyData);
            setSuccess('Policy updated successfully!');
            console.log('Policy updated:', updated);
            setTimeout(() => navigate('/'), 2000); // Redirect to dashboard after 2 seconds
        } catch (error) {
            console.error('Failed to update policy:', error);
            setError(error.message || 'Failed to update policy.');
        }
    };

    return (
        <main className='pt-24 pb-32 px-6 max-w-5xl mx-auto'>
            <section className='mb-12'>
                <h1 className='font-headline font-extrabold text-on-surface text-4xl md:text-5xl tracking-tight mb-4'>Update Policy</h1>
                <p className='text-on-surface-variant text-lg max-w-2xl leading-relaxed'>
                    Modify the details of your policy plan.
                </p>
            </section>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
            <div className='w-full lg:w-3/5 bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-lg'>
                <h2 className='font-headline font-bold text-xl mb-8 text-primary'>Edit Policy Details</h2>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div className='space-y-2'>
                        <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>Plan Type</label>
                        <input className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20' type='text' name='plan_type' value={formData.plan_type} onChange={handleChange} />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>Premium Amount</label>
                        <input className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20' type='number' name='premium_amount' value={formData.premium_amount} onChange={handleChange} />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-xs font-semibold uppercase tracking-wider text-outline px-4'>Status</label>
                        <select className='w-full h-14 px-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20' name='status' value={formData.status} onChange={handleChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className='pt-6'>
                        <button className='w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl text-lg' type='submit'>
                            Update Policy
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default UpdatePolicy;
