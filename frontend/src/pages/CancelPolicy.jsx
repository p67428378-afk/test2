import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deletePolicy } from '../services/policyService';

const CancelPolicy = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel your policy?')) {
            setError(null);
            setSuccess(null);
            try {
                await deletePolicy(policyId);
                setSuccess('Policy cancelled successfully!');
                console.log('Policy cancelled');
                setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
            } catch (error) {
                console.error('Failed to cancel policy:', error);
                setError(error.message || 'Failed to cancel policy.');
            }
        }
    };

    return (
        <main className='pt-24 px-6 max-w-2xl mx-auto'>
            <div className='mb-12'>
                <h1 className='text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight'>Cancel Policy</h1>
                <p className='mt-4 text-lg text-on-surface-variant'>Review the details before confirming cancellation.</p>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

            {/* ... [rest of the informational UI] ... */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        <div className='md:col-span-2 bg-surface-container-low p-8 rounded-xl border-l-4 border-tertiary'>\n          <div className='flex items-start gap-4'>\n            <span className='material-symbols-outlined text-tertiary text-3xl'>warning</span>\n            <div>\n              <h3 className='text-xl font-bold text-on-surface mb-2'>Immediate Cessation</h3>\n              <p className='text-on-surface-variant text-sm leading-relaxed'>\n                Your active coverage for <span className='font-bold text-on-surface'>Health Shield Plus</span> will terminate at 11:59 PM tonight. Any incidents occurring after this time will not be covered.\n              </p>\n            </div>\n          </div>\n        </div>\n        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col gap-3'>\n          <span className='material-symbols-outlined text-primary text-2xl'>history</span>\n          <h4 className='font-bold text-on-surface'>Grace Periods</h4>\n          <p className='text-xs text-on-surface-variant leading-relaxed'>\n            Most providers require a 90-day waiting period for new enrollments. Re-activating later may result in higher premiums.\n          </p>\n        </div>\n        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col gap-3'>\n          <span className='material-symbols-outlined text-primary text-2xl'>receipt_long</span>\n          <h4 className='font-bold text-on-surface'>Claims Impact</h4>\n          <p className='text-xs text-on-surface-variant leading-relaxed'>\n            Unfiled claims must be submitted within 48 hours of cancellation to be considered for reimbursement.\n          </p>\n        </div>\n      </div>

            <div className='flex flex-col gap-4 mb-16'>
                <button onClick={() => navigate('/')} className='w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl text-lg'>
                    Keep My Policy
                </button>
                <button onClick={handleCancel} className='w-full py-5 bg-red-500 text-white font-semibold rounded-xl text-lg'>
                    Confirm Cancellation
                </button>
            </div>
        </main>
    );
};

export default CancelPolicy;
