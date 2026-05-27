import React, { useState, useEffect, useRef } from 'react';

const OTPVerificationModal = ({ onSubmit, isSubmitting, error, onResend }) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(otp.join(''));
  };

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[100] flex items-center justify-center p-md">
      <div className="bg-surface-container-lowest w-full max-w-[440px] rounded-xl tonal-elevation-2 p-xl space-y-xl">
        <div className="space-y-base">
          <h3 className="text-title-lg font-title-lg text-on-surface">Verify Card Ownership</h3>
          <p className="text-body-md font-body-md text-on-surface-variant">An OTP has been sent to your registered mobile/email ending in **89.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-base">
            {otp.map((data, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                className="otp-input w-12 h-14 text-center text-headline-md border border-outline-variant rounded-lg focus:border-primary transition-all"
                maxLength="1"
                type="text"
                value={data}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
              />
            ))}
          </div>
          
          {error && <p className="text-error text-sm mt-4">{error}</p>}

          <div className="space-y-md mt-xl">
            <button 
              className="w-full h-[48px] bg-primary-container text-on-primary font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              type="submit"
              disabled={isSubmitting || otp.join('').length < 6}
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="flex flex-col items-center gap-xs">
              <button 
                type="button"
                onClick={onResend}
                disabled={timer > 0}
                className="text-on-surface-variant font-label-md hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
              <span className="text-label-sm font-label-sm text-error" id="timer">
                {timer > 0 ? `OTP expires in 00:${timer < 10 ? '0' : ''}${timer}` : 'OTP expired'}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
