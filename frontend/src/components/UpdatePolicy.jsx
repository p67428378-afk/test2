
import React from 'react';

const UpdatePolicy = () => {
    return (
        <section className='flex-shrink-0 w-[800px]'>
            <div className='bg-surface-container-lowest rounded-full h-[600px] p-10 flex flex-col'>
                <div className='flex justify-between items-center mb-8'>
                    <h3 className='text-2xl font-extrabold text-on-surface'>Manage Policy Settings</h3>
                    <div className='flex space-x-2'>
                        <span className='px-4 py-1 bg-surface-container text-on-secondary-container text-xs font-bold rounded-full'>LATEST UPDATE: OCT 12</span>
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-8 flex-grow'>
                    {/* Contact Info Column */}
                    <div className='space-y-6'>
                        <h4 className='text-sm font-black text-primary uppercase tracking-widest'>Personal Details</h4>
                        <div className='space-y-4'>
                            <div className='group'>
                                <label className='block text-xs font-bold text-on-surface-variant mb-2'>Primary Contact Email</label>
                                <input className='w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all' type='email' value='alex.j@example.com' />
                            </div>
                            <div className='group'>
                                <label className='block text-xs font-bold text-on-surface-variant mb-2'>Residential Address</label>
                                <textarea className='w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all' rows='3'>1248 Sanctuary Drive, Medical District, WA 98101</textarea>
                            </div>
                        </div>
                    </div>
                    {/* Beneficiaries & Coverage */}
                    <div className='space-y-6'>
                        <h4 className='text-sm font-black text-primary uppercase tracking-widest'>Beneficiaries</h4>
                        <div className='bg-surface-container-low rounded-xl p-4 space-y-3'>
                            <div className='flex items-center justify-between p-3 bg-white rounded-lg shadow-sm'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs'>SJ</div>
                                    <div>
                                        <p className='text-sm font-bold'>Sarah Johnson</p>
                                        <p className='text-[10px] text-on-surface-variant'>Spouse • 100% Primary</p>
                                    </div>
                                </div>
                                <button className='text-primary-container'><span className='material-symbols-outlined'>edit</span></button>
                            </div>
                            <button className='w-full py-3 border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant text-sm font-medium hover:border-primary hover:text-primary transition-all'>
                                + Add Secondary Beneficiary
                            </button>
                        </div>
                        <div className='pt-4'>
                            <h4 className='text-sm font-black text-primary uppercase tracking-widest mb-4'>Quick Adjustments</h4>
                            <div className='flex gap-4'>
                                <label className='flex-1 flex items-center justify-center gap-2 p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-secondary-container transition-all'>
                                    <span className='material-symbols-outlined text-primary'>add_moderator</span>
                                    <span className='text-xs font-bold'>Dental Plus</span>
                                </label>
                                <label className='flex-1 flex items-center justify-center gap-2 p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-secondary-container transition-all'>
                                    <span className='material-symbols-outlined text-primary'>visibility</span>
                                    <span className='text-xs font-bold'>Vision Extra</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 pt-8 border-t border-surface-container flex justify-end gap-4'>
                    <button className='px-8 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl hover:opacity-80'>Discard Changes</button>
                    <button className='px-12 py-3 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all'>
                        Save Updated Policy
                    </button>
                </div>
            </div>
        </section>
    );
};

export default UpdatePolicy;
