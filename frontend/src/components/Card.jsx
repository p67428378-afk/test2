import React from 'react';

const Card = ({ card }) => {
  return (
    <div className='bg-surface-container-lowest p-8 rounded-xl relative overflow-hidden group shadow-[0_20px_40px_rgba(0,31,43,0.06)] border-b-2 border-transparent hover:border-primary transition-all duration-500'>
      <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700'></div>
      <div className='relative z-10 space-y-6'>
        <div className='flex justify-between items-start'>
          <div className='bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest'>{card.name}</div>
          <span className='material-symbols-outlined text-primary' style={{ fontVariationSettings: '\'FILL\' 1' }}>contactless</span>
        </div>
        <div className='aspect-[1.58/1] w-full bg-gradient-to-br from-[#003345] to-[#001f2b] rounded-lg p-6 flex flex-col justify-between text-white shadow-xl'>
          <div className='flex justify-between'>
            <span className='material-symbols-outlined text-3xl opacity-50'>token</span>
            <span className='font-headline font-bold italic'>VAULT</span>
          </div>
          <div className='space-y-1'>
            <p className='text-[10px] opacity-60 uppercase tracking-widest'>Premium Member</p>
            <p className='font-mono text-lg tracking-widest'>•••• •••• •••• 8892</p>
          </div>
        </div>
        <div className='space-y-4'>
          <h4 className='text-xl font-headline font-bold'>{card.description}</h4>
          <ul className='space-y-2'>
            {card.features.map((feature, index) => (
              <li key={index} className='flex items-center gap-2 text-sm text-on-surface-variant'>
                <span className='material-symbols-outlined text-primary text-sm'>check_circle</span>
                {feature}
              </li>
            ))}
          </ul>
          <button className='w-full py-3 bg-primary text-on-primary font-bold rounded-md hover:opacity-90 transition-opacity'>Select {card.name}</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
