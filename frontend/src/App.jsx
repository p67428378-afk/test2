import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    stateZip: '',
    phoneNumber: '',
    emailAddress: '',
    creditScore: 780,
    annualIncome: '',
    employerName: '',
    officeAddress: '',
    jobTitle: '',
    employmentStartDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, creditScore: e.target.value });
  };

  return (
    <div className='bg-surface font-body text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed'>
      <header className='flex justify-between items-center w-full px-8 z-50 fixed top-0 bg-[#00193c] h-16 no-border'>
        <div className='flex items-center gap-8'>
          <span className='font-['Manrope'] text-lg font-extrabold tracking-tighter text-white'>The Architectural Trust</span>
        </div>
      </header>

      <main className='md:ml-64 pt-16 min-h-screen bg-surface-container-low'>
        <section className='p-8'>
          <div className='mb-6 flex justify-between items-end'>
            <div>
              <h1 className='font-display text-2xl font-extrabold text-on-surface tracking-tight'>Premium Credit Selection</h1>
              <p className='text-on-surface-variant font-body text-sm mt-1'>Curated architectural financial tools for high-net-worth professionals.</p>
            </div>
          </div>
          <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
            {/* Cards will be rendered here */}
          </div>
        </section>

        <section className='px-8 pb-12'>
          <div className='bg-surface-container-lowest rounded-xl p-10 shadow-sm'>
            <div className='mb-10'>
              <h2 className='font-display text-xl font-extrabold text-on-surface'>Application Workspace</h2>
              <div className='w-16 h-1 bg-on-tertiary-container mt-2'></div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-16'>
              {/* Personal Details */}
              <div className='flex flex-col gap-8'>
                {/* ... form fields ... */}
              </div>
              {/* Financial & Assets */}
              <div className='flex flex-col gap-8'>
                {/* ... form fields ... */}
              </div>
              {/* Professional Background */}
              <div className='flex flex-col gap-8'>
                {/* ... form fields ... */}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
