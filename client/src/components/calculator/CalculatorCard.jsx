import React, { useState } from 'react';
import DisplaySection from './DisplaySection';
import KeypadButton from '../common/KeypadButton';
import { calculate } from '../../services/api';

const CalculatorCard = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState('');
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);
  const [shouldResetInput, setShouldResetInput] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDigit = (digit) => {
    if (isError) {
      handleClear();
    }

    if (currentInput === '0' || shouldResetInput || isError) {
      setCurrentInput(digit);
      setShouldResetInput(false);
    } else {
      setCurrentInput((prev) => prev + digit);
    }
    setIsError(false);
  };

  const handleDecimal = () => {
    if (isError) {
      handleClear();
    }

    if (shouldResetInput || isError) {
      setCurrentInput('0.');
      setShouldResetInput(false);
      setIsError(false);
      return;
    }

    if (!currentInput.includes('.')) {
      setCurrentInput((prev) => (prev === '' ? '0.' : prev + '.'));
    }
  };

  const handleOperator = (op) => {
    if (isError) {
      handleClear();
      return;
    }

    const val = currentInput || '0';
    setOperand1(val);
    setOperator(op);
    setHistory(`${val} ${op}`);
    setShouldResetInput(true);
  };

  const handleEquals = async () => {
    if (!operator || operand1 === null) return;

    const val2 = currentInput || '0';
    setLoading(true);
    const response = await calculate(operand1, val2, operator);
    setLoading(false);

    if (response.error) {
      setCurrentInput(response.error);
      setHistory(`${operand1} ${operator} ${val2} =`);
      setIsError(true);
    } else {
      setCurrentInput(String(response.result));
      setHistory(`${operand1} ${operator} ${val2} =`);
      setOperand1(null);
      setOperator(null);
      setShouldResetInput(true);
    }
  };

  const handleClear = () => {
    setCurrentInput('');
    setHistory('');
    setOperand1(null);
    setOperator(null);
    setShouldResetInput(false);
    setIsError(false);
  };

  const handleToggleSign = () => {
    if (isError) {
      handleClear();
      return;
    }
    if (!currentInput) return;
    if (currentInput.startsWith('-')) {
      setCurrentInput(currentInput.substring(1));
    } else {
      setCurrentInput('-' + currentInput);
    }
  };

  const handlePercent = () => {
    if (isError) {
      handleClear();
      return;
    }
    if (!currentInput) return;
    const val = parseFloat(currentInput) / 100;
    setCurrentInput(String(val));
  };

  return (
    <div className='w-full max-w-[400px] bg-[#1E293B] border border-[#334155] rounded-2xl shadow-2xl p-6 relative z-10'>
      {loading && (
        <div className='absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      )}
      <DisplaySection history={history} currentInput={currentInput} />
      <div className='grid grid-cols-4 gap-4'>
        {/* Row 1 */}
        <KeypadButton className='btn-clear' onClick={handleClear}>C</KeypadButton>
        <KeypadButton className='btn-num' onClick={handleToggleSign}>+/-</KeypadButton>
        <KeypadButton className='btn-num' onClick={handlePercent}>%</KeypadButton>
        <KeypadButton className='btn-op' onClick={() => handleOperator('/')}>/</KeypadButton>

        {/* Row 2 */}
        <KeypadButton className='btn-num' onClick={() => handleDigit('7')}>7</KeypadButton>
        <KeypadButton className='btn-num' onClick={() => handleDigit('8')}>8</KeypadButton>
        <KeypadButton className='btn-num' onClick={() => handleDigit('9')}>9</KeypadButton>
        <KeypadButton className='btn-op' onClick={() => handleOperator('*')}>
          <span className='material-symbols-outlined text-[24px]'>close</span>
        </KeypadButton>

        {/* Row 3 */}
        <KeypadButton className='btn-num' onClick={() => handleDigit('4')}>4</KeypadButton>
        <KeypadButton className='btn-num' onClick={() => handleDigit('5')}>5</KeypadButton>
        <KeypadButton className='btn-num' onClick={() => handleDigit('6')}>6</KeypadButton>
        <KeypadButton className='btn-op' onClick={() => handleOperator('-')}>-</KeypadButton>

        {/* Row 4 */}
        <KeypadButton className='btn-num' onClick={() => handleDigit('1')}>1</KeypadButton>
        <KeypadButton className='btn-num' onClick={() => handleDigit('2')}>2</KeypadButton>
        <KeypadButton className='btn-num' onClick={() => handleDigit('3')}>3</KeypadButton>
        <KeypadButton className='btn-op' onClick={() => handleOperator('+')}>+</KeypadButton>

        {/* Row 5 */}
        <KeypadButton className='btn-num col-span-2' onClick={() => handleDigit('0')}>0</KeypadButton>
        <KeypadButton className='btn-num' onClick={handleDecimal}>.</KeypadButton>
        <KeypadButton className='btn-eq' onClick={handleEquals}>=</KeypadButton>
      </div>
    </div>
  );
};

export default CalculatorCard;
