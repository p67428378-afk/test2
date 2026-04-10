'''import React, { useState, useEffect } from 'react';
import { calculatePremium } from '../services/api';

const ncbTiers = [
    { years: 0, discount: 0 },
    { years: 1, discount: 20 },
    { years: 2, discount: 25 },
    { years: 3, discount: 35 },
    { years: 4, discount: 45 },
    { years: 5, discount: 50 },
];

const PremiumCalculator = () => {
    const [policyholderName, setPolicyholderName] = useState('');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [manufacturingYear, setManufacturingYear] = useState(2024);
    const [baseRate, setBaseRate] = useState(500);
    const [claimFreeYears, setClaimFreeYears] = useState(3);
    const [vehicleMultiplier, setVehicleMultiplier] = useState(1.25);
    const [calculatedPremium, setCalculatedPremium] = useState(406.25);
    const [error, setError] = useState(null);

    const handleNcbClick = (years) => {
        setClaimFreeYears(years);
    };

    const handleCalculation = async () => {
        setError(null);
        try {
            const response = await calculatePremium({
                baseRate,
                claimFreeYears,
                vehicleMultiplier,
            });
            setCalculatedPremium(response.premium);
        } catch (err) {
            setError(err.detail || 'An error occurred during calculation.');
        }
    };

    useEffect(() => {
        handleCalculation();
    }, [baseRate, claimFreeYears, vehicleMultiplier]);

    const getNcbDiscount = (years) => {
        const tier = ncbTiers.find(t => t.years === years) || ncbTiers.find(t => years >= 5);
        return tier ? tier.discount : 0;
    }

    return (
        <div className="ml-64 min-h-screen flex flex-col">
            <header className="flex justify-between items-center px-8 py-4 w-full max-w-full mx-auto bg-white dark:bg-slate-900 border-b-0 font-manrope font-bold text-sm tracking-tight sticky top-0 z-30">
                <div className="text-2xl font-extrabold text-blue-900 dark:text-blue-300 tracking-tighter">Precision Architect</div>
                <nav className="hidden md:flex gap-8 items-center">
                    <a className="text-slate-500 dark:text-slate-400 hover:text-blue-700 transition-colors" href="#">Policies</a>
                    <a className="text-slate-500 dark:text-slate-400 hover:text-blue-700 transition-colors" href="#">Claims</a>
                    <a className="text-slate-500 dark:text-slate-400 hover:text-blue-700 transition-colors" href="#">Renewals</a>
                    <a className="text-slate-500 dark:text-slate-400 hover:text-blue-700 transition-colors" href="#">Analytics</a>
                </nav>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-slate-500">
                        <span className="material-symbols-outlined cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-all" data-icon="notifications">notifications</span>
                        <span className="material-symbols-outlined cursor-pointer hover:bg-slate-50 p-2 rounded-full transition-all" data-icon="settings">settings</span>
                    </div>
                    <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-bold scale-95 active:scale-90 transition-transform">New Quote</button>
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCreg6al1-sv5Gq2eHGU-HGNcdrmtLmRrKMRgAU2ZtDF8TVJZQUuI8JnBx0NRNp0j2GfCYz_XOXrjVRJqRAu0gnhcgG56A_up9ZL8OSd1zEf1mEVy6Be_i2wb6wdYg2CtsqcoakXC53gp6VQoyV5GS-xtXkbXHzb6NexVyUZCiOcEkHIKl27moCBezHzufSNDR8ESoihLiBNg83g2aBxUcQ00DipAg56P03hBJbHiLM24CWwhjbHMayvhzSG3c8SNBkl3OLnDbVs6I" />
                    </div>
                </div>
            </header>
            <main className="flex-1 p-8 bg-surface-container-low">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h2 className="text-4xl font-headline font-extrabold text-primary tracking-tight">Premium Calculator</h2>
                            <p className="text-on-surface-variant font-body mt-2">Design your coverage with architectural precision and data-driven insights.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-lg font-semibold hover:bg-surface-dim transition-colors">Drafts (12)</button>
                            <button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm" data-icon="share">share</span>
                                Share Report
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-8">
                        <section className="col-span-12 lg:col-span-4 space-y-6">
                            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded bg-primary-fixed flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined" data-icon="person">person</span>
                                    </div>
                                    <h3 className="text-xl font-headline font-bold text-primary">Client Dossier</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Policyholder Name</label>
                                        <input className="w-full bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 transition-all placeholder:text-slate-400" placeholder="e.g. Julian Anderson" type="text" value={policyholderName} onChange={(e) => setPolicyholderName(e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Vehicle Make</label>
                                            <input className="w-full bg-surface-container-high border-none focus:ring-0 rounded-lg px-4 py-3" placeholder="Mercedes-Benz" type="text" value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Model</label>
                                            <input className="w-full bg-surface-container-high border-none focus:ring-0 rounded-lg px-4 py-3" placeholder="EQS Sedan" type="text" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Manufacturing Year</label>
                                        <select className="w-full bg-surface-container-high border-none focus:ring-0 rounded-lg px-4 py-3 appearance-none" value={manufacturingYear} onChange={(e) => setManufacturingYear(parseInt(e.target.value))}>
                                            <option>2024</option>
                                            <option>2023</option>
                                            <option>2022</option>
                                            <option>2021</option>
                                            <option>2020</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-surface-container-lowest rounded-xl overflow-hidden relative h-64">
                                <img alt="Luxury Vehicle" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9qBdgHzCwo3OL_0OWmpHRHq9u61ttWYF4akaXKYXhZgggWCZHjQTO-6p3_MJLAFsypFbssPhCYnEQHf-gbFYK8XyhzI-zReCYzVqk6lnPouWOKF9s0R5KWV6DUW2PHF8j22cnoUH7_xnsAZ_U0sfS4H76LqZfiqBlCjQX3uI9SPxtWLlYiUxsWqRP7wcbLCaATzZ9F7skOcw-FsLEoYMqeC8Gj5elYmNWrN9MDC4jHrd_df1DMJXfIRozo16YKCfEoFY5lf0_hgU" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
                                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Active Asset</span>
                                    <h4 className="text-white text-xl font-headline font-bold">2024 Mercedes-Benz EQS</h4>
                                </div>
                            </div>
                        </section>
                        <section className="col-span-12 lg:col-span-5 space-y-8">
                            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-headline font-bold text-primary">Valuation Parameters</h3>
                                    <span className="text-tertiary font-bold text-xs bg-tertiary-fixed/20 px-3 py-1 rounded-full">Standardized ISO-9001</span>
                                </div>
                                <div className="mb-10">
                                    <label className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-on-surface">Base Rate</span>
                                        <span className="text-primary font-black font-headline">${baseRate.toFixed(2)}</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
                                        <input className="w-full pl-10 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 font-headline text-lg font-bold text-primary" type="number" value={baseRate} onChange={(e) => setBaseRate(parseFloat(e.target.value))} />
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <label className="block text-sm font-bold text-on-surface mb-4">No Claim Bonus (NCB) Tiers</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {ncbTiers.slice(1).map(tier => (
                                            <button
                                                key={tier.years}
                                                onClick={() => handleNcbClick(tier.years)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all group ${claimFreeYears === tier.years ? 'bg-primary text-white ring-4 ring-primary-fixed/30 transform scale-105 shadow-lg' : 'bg-surface-container-high hover:bg-surface-container-highest'}`}
                                            >
                                                <span className={`text-[10px] font-bold mb-1 ${claimFreeYears === tier.years ? 'opacity-80' : 'text-on-surface-variant'}`}>{tier.years} Yr</span>
                                                <span className={`text-sm font-black ${claimFreeYears === tier.years ? '' : 'text-primary'}`}>{tier.discount}%</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-sm font-bold text-on-surface">Vehicle Multiplier</label>
                                        <span className="px-3 py-1 bg-primary text-white text-xs font-black rounded">{vehicleMultiplier.toFixed(2)}x</span>
                                    </div>
                                    <input className="w-full accent-primary h-2 rounded-lg cursor-pointer appearance-none" max="1.6" min="0.8" step="0.05" type="range" value={vehicleMultiplier} onChange={(e) => setVehicleMultiplier(parseFloat(e.target.value))} />
                                    <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                                        <span>Economic (0.8x)</span>
                                        <span>Neutral (1.0x)</span>
                                        <span>Performance (1.6x)</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="col-span-12 lg:col-span-3 space-y-6">
                            <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40 flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-tertiary-fixed-dim/20 rounded-full blur-3xl"></div>
                                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-6">Annual Quotation</span>
                                <div className="text-6xl font-headline font-extrabold text-primary mb-2 tracking-tighter">
                                    ${calculatedPremium.toFixed(2).split('.')[0]}<span className="text-2xl">.{calculatedPremium.toFixed(2).split('.')[1]}</span>
                                </div>
                                <div className="flex items-center gap-2 text-tertiary font-bold mb-8">
                                    <span className="material-symbols-outlined text-sm" data-icon="verified_user">verified_user</span>
                                    <span>{getNcbDiscount(claimFreeYears)}% Savings Applied</span>
                                </div>
                                <div className="w-full bg-surface-container p-4 rounded-xl mb-8 space-y-2 text-left">
                                    <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                                        <span>Base Premium</span>
                                        <span>${baseRate.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-tertiary">
                                        <span>NCB Deduction</span>
                                        <span>-${(baseRate * (getNcbDiscount(claimFreeYears) / 100)).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-outline-variant/20 flex justify-between text-sm font-bold text-primary">
                                        <span>Payable Total</span>
                                        <span>${calculatedPremium.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-white font-headline font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                                    Bind Policy Now
                                </button>
                                {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
                            </div>
                            <div className="bg-primary/5 p-6 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg" data-icon="info">info</span>
                                    Precision Insight
                                </h4>
                                <p className="text-xs leading-relaxed text-on-surface-variant">
                                    Your calculation reflects a <span className="font-bold text-on-surface">{vehicleMultiplier.toFixed(2)}x Multiplier</span> for performance category vehicles. Maintain your NCB streak to unlock up to 50% discount in future periods.
                                </p>
                                <a className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1" href="#">
                                    View Calculation Logic
                                    <span className="material-symbols-outlined text-xs" data-icon="arrow_right_alt">arrow_right_alt</span>
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PremiumCalculator;
''