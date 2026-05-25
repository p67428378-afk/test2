import { useState } from 'react';
import axios from 'axios';

const PremiumCalculator = () => {
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [ncbLevel, setNcbLevel] = useState(0);
  const [premium, setPremium] = useState(null);

  const handleCalculatePremium = async () => {
    try {
      const response = await axios.post('/api/v1/calculate-premium', {
        vehicle_make: vehicleMake,
        vehicle_model: vehicleModel,
        vehicle_year: parseInt(vehicleYear),
        ncb_level: ncbLevel,
      });
      setPremium(response.data.premium_amount);
    } catch (error) {
      console.error('Error calculating premium:', error);
    }
  };

  return (
    <main className='pt-28 px-6 max-w-5xl mx-auto'>
      <section className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8'>
        <div className='max-w-2xl'>
          <h1 className='font-headline font-extrabold text-5xl md:text-6xl text-on-surface tracking-tight leading-tight'>
            Premium Quote
          </h1>
          <p className='mt-4 text-secondary text-lg font-medium max-w-lg'>
            Precision-engineered coverage for your journey. Calculate your bespoke vehicle protection plan in seconds.
          </p>
        </div>
        <div className='hidden md:block'>
          <div className='bg-tertiary-container px-4 py-2 rounded-full inline-flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse'></span>
            <span className='text-on-tertiary-container font-label font-bold text-xs uppercase tracking-widest'>Live Rates Active</span>
          </div>
        </div>
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
        <div className='lg:col-span-7 space-y-8'>
          <div className='bg-surface-container-lowest p-8 rounded-xl shadow-[0_4px_20px_rgba(0,49,120,0.04)]'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center'>
                <span className='material-symbols-outlined text-primary'>directions_car</span>
              </div>
              <h2 className='font-headline text-2xl font-bold tracking-tight'>Vehicle Details</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2'>
                <label className='font-label text-sm font-bold text-secondary uppercase tracking-wider ml-1'>Vehicle Make</label>
                <select
                  className='w-full bg-surface-container-low border-0 rounded-lg py-4 px-4 focus:ring-2 focus:ring-primary-fixed font-medium text-on-surface'
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                >
                  <option>Select Make</option>
                  <option>Mercedes-Benz</option>
                  <option>BMW</option>
                  <option>Audi</option>
                  <option>Tesla</option>
                  <option>Porsche</option>
                </select>
              </div>
              <div className='flex flex-col gap-2'>
                <label className='font-label text-sm font-bold text-secondary uppercase tracking-wider ml-1'>Vehicle Model</label>
                <input
                  className='w-full bg-surface-container-low border-0 rounded-lg py-4 px-4 focus:ring-2 focus:ring-primary-fixed font-medium text-on-surface placeholder:text-outline-variant'
                  placeholder='e.g. Model S, 911 Carrera'
                  type='text'
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                />
              </div>
              <div className='md:col-span-2 flex flex-col gap-2'>
                <label className='font-label text-sm font-bold text-secondary uppercase tracking-wider ml-1'>Manufacturing Year</label>
                <select
                  className='w-full bg-surface-container-low border-0 rounded-lg py-4 px-4 focus:ring-2 focus:ring-primary-fixed font-medium text-on-surface'
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                >
                  <option>Select Year</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                </select>
              </div>
            </div>
          </div>

          <div className='bg-surface-container-lowest p-8 rounded-xl shadow-[0_4px_20px_rgba(0,49,120,0.04)]'>
            <div className='flex items-center gap-3 mb-8'>
              <div className='w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center'>
                <span className='material-symbols-outlined text-primary'>history</span>
              </div>
              <h2 className='font-headline text-2xl font-bold tracking-tight'>Driving History</h2>
            </div>
            <div className='space-y-6'>
              <div className='flex justify-between items-center mb-2'>
                <label className='font-label text-sm font-bold text-secondary uppercase tracking-wider ml-1'>No Claims Bonus (NCB)</label>
                <span className='text-primary font-bold text-lg'>{ncbLevel * 10}% Savings</span>
              </div>
              <div className='flex bg-surface-container-low p-1.5 rounded-xl gap-1'>
                {[0, 20, 30, 40, 50].map((ncb) => (
                  <button
                    key={ncb}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${ncbLevel * 10 === ncb ? 'bg-white shadow-sm text-primary ring-1 ring-blue-900/5' : 'text-secondary hover:bg-surface-container'}`}
                    onClick={() => setNcbLevel(ncb / 10)}
                  >
                    {ncb}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className='pt-4 flex flex-col md:flex-row gap-4'>
            <button
              className='flex-1 premium-gradient text-white py-5 px-8 rounded-xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all'
              onClick={handleCalculatePremium}
            >
              Calculate My Premium
              <span className='material-symbols-outlined'>arrow_forward</span>
            </button>
            <button className='flex-1 border-2 border-outline-variant hover:bg-surface-container-low transition-colors text-primary py-5 px-8 rounded-xl font-bold text-lg active:scale-[0.98]'>
              View Quote Breakdown
            </button>
          </div>
        </div>

        <div className='lg:col-span-5 space-y-8'>
          {premium !== null && (
            <div className='bg-primary text-white p-10 rounded-xl premium-gradient relative overflow-hidden shadow-2xl'>
              <div className='absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl'></div>
              <div className='relative z-10'>
                <p className='font-label text-white/70 text-sm font-bold uppercase tracking-[0.2em] mb-4'>Estimated Annual Premium</p>
                <div className='flex items-baseline gap-2 mb-8'>
                  <span className='text-6xl font-headline font-extrabold tracking-tighter'>${premium}</span>
                  <span className='text-white/60 font-medium text-lg'>/year</span>
                </div>
                <div className='space-y-4 pt-8 border-t border-white/10'>
                  <div className='flex justify-between items-center'>
                    <span className='text-white/70 font-medium'>Monthly Installments</span>
                    <span className='font-bold text-xl'>${(premium / 12).toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between items-center text-on-tertiary-container bg-tertiary-container/20 p-4 rounded-lg'>
                    <span className='font-medium'>Total Savings Applied</span>
                    <span className='font-extrabold text-xl'>-${(500 * 1.2 * (ncbLevel / 10) - premium).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className='bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(0,49,120,0.04)] relative border-l-4 border-primary'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0'>
                <span className='material-symbols-outlined text-primary' data-weight='fill'>verified_user</span>
              </div>
              <div>
                <h3 className='font-headline font-bold text-xl mb-2'>Price Protection</h3>
                <p className='text-secondary leading-relaxed'>
                  Our <span className='text-primary font-semibold'>Guaranteed Price Protection</span> ensures that your quote remains locked for the next 30 days. No hidden fees or unexpected mid-term increases.
                </p>
                <div className='mt-6 flex items-center gap-2'>
                  <img alt='Trust Logotypes' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBhL6xgjFueEfA2DreNF3wlOogRTu2qUEcii9gF5e7urF7D3P1P7vx64HEkV5lyvQb-d1Fq03Yzoscg7GT7-BU3myUT-w4dIY-ZDGH6f-C3QHQckKyxtpN-8Gulm6dkX-jWgxilbclzHr2PcXOl0gaNgT6I8JEqdgwLr7OrhnL8NHwPubj_FdQO8qIs3UyNTLhxdNWlEXtZVXN4enWxLiYWCZP3M8E75D_Lu2FkUOgW5JtrDPQ-CJa9pkZ-eq_8LjrZTNPvlT5PU9Ua' />
                  <span className='text-[10px] font-bold text-outline uppercase tracking-widest ml-2'>Certified Partners</span>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-xl overflow-hidden group relative h-64 shadow-xl'>
            <img alt='Luxury Vehicle' className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBeIHKJVQLTOKyY0tVGJPMf8ToCN3kyzAvYdAdN-oOCLgVcwcrFUcpPTE-jTs_Lft6ZcZIEmUEg4vOMpVqg14MZ4hNS8RhN4DiFgT1HKPGJwISXqFdUO72b3ZdLlDMaWGHm2g_LYoklUwIit0rMIyj7ThkQIOsIGrZSXoAkinVckXvHqXSCe_cmM1xYnChrIGPhnl0jtKGa-ARb-6eDqwmvbVdQz5rC7IB9_T_-oU7ppTNmuQ36OThN6Lh970PmFwx-Px-p-BY6wGEL' />
            <div className='absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6'>
              <p className='text-white font-headline font-bold text-lg leading-snug'>
                Tailored for those who appreciate precision and luxury.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PremiumCalculator;
