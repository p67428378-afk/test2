import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CurrencyInput from 'react-currency-input-field';
import api from '../services/api';

const CreditCardApplicationFormPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        contactInformation: '',
        dateOfBirth: null,
        address: '',
        employmentStatus: 'Employed',
        annualIncome: '',
        existingCreditObligations: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dateOfBirth: date });
    };

    const handleCurrencyChange = (value) => {
        setFormData({ ...formData, annualIncome: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/applications', formData);
            navigate('/options', { state: { creditScore: response.data.credit_score } });
        } catch (error) {
            console.error('Error submitting application:', error);
        }
    };

    return (
        <div className='font-body-md text-on-surface'>
            <header className='fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm'>
                {/* ... Header content from HTML ... */}
            </header>
            <div className='flex pt-16'>
                <aside className='fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-gray-50 border-r border-gray-200 flex flex-col p-6 gap-2 font-manrope text-sm'>
                    {/* ... Sidebar content from HTML ... */}
                </aside>
                <main className='ml-72 flex-1 p-10 flex justify-center overflow-y-auto min-h-[calc(100vh-64px)]'>
                    <div className='max-w-[800px] w-full flex flex-col gap-8 pb-20'>
                        <div className='mb-4'>
                            <h1 className='text-display-lg font-headline-md text-on-surface'>Credit Card Application</h1>
                            <p className='text-body-lg text-secondary mt-2'>Provide your details to find the best card suited for your financial profile.</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <section className='bg-white p-lg rounded-xl shadow-sm border border-gray-200 mb-8'>
                                <div className='flex items-center gap-2 mb-xl'>
                                    <div className='w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center'>
                                        <span className='material-symbols-outlined text-primary'>person</span>
                                    </div>
                                    <h2 className='text-headline-md font-headline-md text-on-surface'>Personal Details</h2>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-lg'>
                                    <div className='flex flex-col gap-xs'>
                                        <label className='text-label-md text-on-surface-variant font-semibold'>Full Name</label>
                                        <input className='h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md' placeholder='John Doe' type='text' name='fullName' value={formData.fullName} onChange={handleChange} />
                                    </div>
                                    <div className='flex flex-col gap-xs'>
                                        <label className='text-label-md text-on-surface-variant font-semibold'>Contact Information</label>
                                        <input className='h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md' placeholder='john.doe@example.com' type='email' name='contactInformation' value={formData.contactInformation} onChange={handleChange} />
                                    </div>
                                    <div className='flex flex-col gap-xs'>
                                        <label className='text-label-md text-on-surface-variant font-semibold'>Date of Birth</label>
                                        <DatePicker selected={formData.dateOfBirth} onChange={handleDateChange} className='w-full h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md' />
                                    </div>
                                    <div className='flex flex-col gap-xs'>
                                        <label className='text-label-md text-on-surface-variant font-semibold'>Current Address</label>
                                        <input className='h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md' placeholder='123 Main St' type='text' name='address' value={formData.address} onChange={handleChange} />
                                    </div>
                                </div>
                            </section>
                            <section className='bg-white p-lg rounded-xl shadow-sm border border-gray-200 mb-8'>
                                <div className='flex items-center gap-2 mb-xl'>
                                    <div className='w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center'>
                                        <span className='material-symbols-outlined text-primary'>work</span>
                                    </div>
                                    <h2 className='text-headline-md font-headline-md text-on-surface'>Employment & Income</h2>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-lg'>
                                    <div className='flex flex-col gap-xs'>
                                        <label className='text-label-md text-on-surface-variant font-semibold'>Employment Status</label>
                                        <select className='h-12 px-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md appearance-none bg-no-repeat bg-[right_1rem_center]' name='employmentStatus' value={formData.employmentStatus} onChange={handleChange}>
                                            <option>Employed</option>
                                            <option>Self-Employed</option>
                                            <option>Unemployed</option>
                                            <option>Student</option>
                                            <option>Retired</option>
                                        </select>
                                    </div>
                                    <div className='flex flex-col gap-xs'>
                                        <label className='text-label-md text-on-surface-variant font-semibold'>Annual Income</label>
                                        <CurrencyInput
                                            className='w-full h-12 pl-8 pr-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md'
                                            placeholder='$75,000'
                                            prefix='$'
                                            onValueChange={handleCurrencyChange}
                                            value={formData.annualIncome}
                                        />
                                    </div>
                                </div>
                            </section>
                            <section className='bg-white p-lg rounded-xl shadow-sm border border-gray-200 mb-8'>
                                <div className='flex items-center gap-2 mb-xl'>
                                    <div className='w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center'>
                                        <span className='material-symbols-outlined text-primary'>account_balance_wallet</span>
                                    </div>
                                    <h2 className='text-headline-md font-headline-md text-on-surface'>Existing Credit Obligations</h2>
                                </div>
                                <div className='flex flex-col gap-xs'>
                                    <label className='text-label-md text-on-surface-variant font-semibold'>List your current monthly obligations (Optional)</label>
                                    <textarea className='p-4 rounded-lg border-gray-300 focus:ring-2 focus:ring-primary focus:ring-opacity-10 focus:border-primary transition-all text-body-md resize-none' placeholder='Mortgage, Car Loan, Student Debt' rows='4' name='existingCreditObligations' value={formData.existingCreditObligations} onChange={handleChange}></textarea>
                                    <p className='text-label-sm text-gray-500 mt-2'>Enter one item per line for better clarity in the assessment.</p>
                                </div>
                            </section>
                            <div className='flex items-center justify-between pt-lg'>
                                <div className='flex items-center gap-2 text-secondary'>
                                    <span className='material-symbols-outlined text-sm'>lock</span>
                                    <span className='text-label-sm'>Your data is secured with bank-grade encryption</span>
                                </div>
                                <button type='submit' className='px-10 h-14 bg-[#4F46E5] text-white font-headline-sm rounded-lg hover:shadow-lg hover:bg-indigo-700 transition-all active:scale-95 duration-150 flex items-center gap-3'>
                                    Submit Application
                                    <span className='material-symbols-outlined'>arrow_forward</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreditCardApplicationFormPage;
