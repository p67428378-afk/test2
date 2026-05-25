
import React from 'react';

const DocumentPreview = () => {
  return (
    <section className='relative h-[415px] rounded-xl overflow-hidden shadow-2xl group'>
      <img alt='Abstract visual' className='absolute inset-0 w-full h-full object-cover' data-alt='abstract artistic background of deep navy blue and soft white silk waves flowing elegantly with architectural lighting and shadows' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCPHCd4nTfgCgrslVjwyArnQi7r-O6Ju-sqdlzN5eRVPQp-oJFpnZrMpw9xqzjI-LngXzoFzBOXzxpOD8UMLo4M0kQkm8iACvZ_wEuD5PNN_yDYAjJZJjtyWPFysSCdXhmhNNz-2l0SaZJf0mwfoHRlafg45Ak3cTyfv6NX0vV3Q-p5Nj0GaIrKoG36f5pM_73nM0gza-WdvcbOmKX4yrBjuIcmVJ6KxoLLQKLUX2rkDxuZPOSrgxuD7hmt7SpLcVkxaHFsqbnb5vM'/>
      <div className='absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent opacity-90'></div>
      <div className='absolute bottom-0 left-0 p-8 w-full'>
        <div className='glass-panel p-6 rounded-xl border border-white/20'>
          <h4 className='font-headline font-bold text-lg text-blue-950 mb-2'>Architectural Security</h4>
          <p className='text-xs text-blue-900/80 leading-relaxed'>The Architectural Sentinel employs multi-layer AES-256 encryption for all PII data. Documents are shredded in memory immediately after OCR processing is confirmed by the blockchain ledger.</p>
        </div>
      </div>
    </section>
  );
};

export default DocumentPreview;
