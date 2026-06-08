import React, { useRef } from 'react';

export default function OTPInputGroup({ value, onChange, error }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newValue = value.split('');
    newValue[index] = val.slice(-1); // Keep only the last character
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    // Auto-focus next input
    if (val && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1].focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      } else {
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData.padEnd(6, ''));
      const focusIndex = Math.min(pastedData.length, 5);
      inputsRef.current[focusIndex].focus();
    }
  };

  return (
    <div className='space-y-sm'>
      <div className='flex justify-between gap-sm' onPaste={handlePaste}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            type='text'
            maxLength='1'
            value={value[index] || ''}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-12 h-12 text-center font-headline-md text-headline-md bg-surface-container-lowest border ${
              error ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-[#0F172A] focus:ring-[#0F172A]'
            } rounded-DEFAULT focus:outline-none focus:ring-1 transition-colors`}
          />
        ))}
      </div>
      {error && (
        <p className='mt-sm font-label-sm text-label-sm text-error text-center' role='alert'>
          {error}
        </p>
      )}
    </div>
  );
}
