import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreditCardOptionsPage = () => {
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const creditScore = location.state?.creditScore || 720; // Default for testing

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                const response = await api.get(`/credit-card-tiers?credit_score=${creditScore}`);
                setTiers(response.data);
            } catch (err) {
                setError('Failed to load credit card options');
                console.error(err);
            }
            setLoading(false);
        };

        fetchTiers();
    }, [creditScore]);

    const handleSelectCard = (tierName) => {
        // In a real app, you would get the application ID from context or state
        const applicationId = 1; // Placeholder
        api.post(`/applications/${applicationId}/select-tier`, { selected_credit_card_tier: tierName })
            .then(() => {
                navigate('/confirmation');
            })
            .catch(err => console.error('Error selecting tier:', err));
    };

    if (loading) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    if (error) {
        return <div>{error} <button onClick={() => window.location.reload()}>Retry</button></div>;
    }

    return (
        <div className='bg-[#F9FAFB] text-on-surface font-body-md min-h-screen'>
            <header className='bg-white dark:bg-slate-900 shadow-sm docked full-width top-0 border-b border-gray-200 dark:border-slate-800 sticky z-50'>
                {/* ... Header content from HTML ... */}
            </header>
            <main className='max-w-[1280px] mx-auto px-6 py-12'>
                <div className='mb-12'>
                    <h1 className='font-display-lg text-on-surface mb-2'>Choose Your Credit Card</h1>
                    <p className='font-body-lg text-on-surface-variant'>Select the card that best fits your financial lifestyle and institutional requirements.</p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-gutter mb-20'>
                    {tiers.map(tier => (
                        <div key={tier.name} className='bg-white rounded-xl border border-[#D1D5DB] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow flex flex-col'>
                            <div className='h-48 rounded-lg mb-6 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between text-white border border-white/10'>
                                {/* ... Card content from HTML ... */}
                                <div className='flex justify-between items-start'>
                                    <span className='font-headline-sm tracking-widest opacity-80'>FinAdvisor</span>
                                    <span className='material-symbols-outlined text-4xl'>contactless</span>
                                </div>
                                <div className='space-y-1'>
                                    <p className='text-[10px] tracking-widest uppercase opacity-60'>{tier.name} Member</p>
                                    <p className='font-headline-sm tracking-widest'>•••• •••• •••• 8842</p>
                                </div>
                            </div>
                            <h3 className='font-headline-md text-[#1F2937] mb-6'>{tier.name}</h3>
                            <div className='space-y-4 mb-8 flex-grow'>
                                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                                    <span className='text-[#6B7280] font-label-md'>APR</span>
                                    <span className='text-[#1F2937] font-headline-sm'>{tier.apr}%</span>
                                </div>
                                <div className='flex justify-between items-center pb-3 border-b border-gray-100'>
                                    <span className='text-[#6B7280] font-label-md'>Limit</span>
                                    <span className='text-[#1F2937] font-headline-sm'>${tier.credit_limit.toLocaleString()}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-[#6B7280] font-label-md'>Rewards</span>
                                    <span className='text-[#1F2937] font-headline-sm'>{tier.rewards_program}</span>
                                </div>
                            </div>
                            <button onClick={() => handleSelectCard(tier.name)} className='w-full h-12 bg-[#4F46E5] text-white rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all'>Select Card</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CreditCardOptionsPage;
