import React, { useState } from 'react';
import DisplayScreen from './DisplayScreen';
import Keypad from './Keypad';
import { calculatePost, calculateGet } from '../../services/api';
import { Lock } from 'lucide-react';

export default function CalculatorCard({ onLogRequest }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);
  const [isResetOnNextInput, setIsResetOnNextInput] = useState(false);
  const [apiMethod, setApiMethod] = useState('POST'); // 'POST' or 'GET'
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyPress = async (value) => {
    if (value === 'C') {
      setDisplayValue('0');
      setExpression('');
      setOperand1(null);
      setOperator(null);
      setIsResetOnNextInput(false);
      return;
    }

    if (value === '()') {
      // Simple parenthesis toggle or placeholder
      return;
    }

    if (value === '%') {
      // Percentage calculation
      const current = parseFloat(displayValue);
      if (!isNaN(current)) {
        const result = current / 100;
        setDisplayValue(result.toString());
        setExpression(`${current} %`);
      }
      return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
      const current = parseFloat(displayValue);
      if (isNaN(current)) return;

      setOperand1(current);
      setOperator(value);
      setExpression(`${current} ${value}`);
      setIsResetOnNextInput(true);
      return;
    }

    if (value === '.') {
      if (isResetOnNextInput) {
        setDisplayValue('0.');
        setIsResetOnNextInput(false);
        return;
      }
      if (!displayValue.includes('.')) {
        setDisplayValue(displayValue + '.');
      }
      return;
    }

    if (value === '=') {
      if (operand1 === null || operator === null) return;
      const operand2 = parseFloat(displayValue);
      if (isNaN(operand2)) return;

      setIsLoading(true);
      setExpression(`${operand1} ${operator} ${operand2} =`);

      let response;
      if (apiMethod === 'POST') {
        response = await calculatePost(operand1, operand2, operator);
      } else {
        response = await calculateGet(operand1, operand2, operator);
      }

      setIsLoading(false);
      onLogRequest(response);

      if (response.success) {
        setDisplayValue(response.data.result.toString());
      } else {
        setDisplayValue('Error');
      }

      setOperand1(null);
      setOperator(null);
      setIsResetOnNextInput(true);
      return;
    }

    // Number keys
    if (displayValue === '0' || isResetOnNextInput) {
      setDisplayValue(value);
      setIsResetOnNextInput(false);
    } else {
      setDisplayValue(displayValue + value);
    }
  };

  return (
    <div className='w-full max-w-md glass-panel rounded-xl flex flex-col shadow-[0_0_40px_rgba(99,102,241,0.05)] border border-outline-variant/30 overflow-hidden'>
      {/* API Method Selector */}
      <div className='bg-surface-container-lowest px-md py-sm border-b border-outline-variant/20 flex items-center justify-between'>
        <span className='font-label-sm text-label-sm text-outline-variant uppercase tracking-wider'>API Method:</span>
        <div className='flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/30'>
          <button
            onClick={() => setApiMethod('POST')}
            className={`px-sm py-1 rounded-md font-label-sm text-label-sm transition-colors ${
              apiMethod === 'POST'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            POST
          </button>
          <button
            onClick={() => setApiMethod('GET')}
            className={`px-sm py-1 rounded-md font-label-sm text-label-sm transition-colors ${
              apiMethod === 'GET'
                ? 'bg-primary text-on-primary font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            GET
          </button>
        </div>
      </div>

      <DisplayScreen expression={expression} value={isLoading ? '...' : displayValue} />
      <Keypad onKeyPress={handleKeyPress} />

      <div className='mt-md text-center pb-md'>
        <p className='font-label-sm text-label-sm text-outline-variant uppercase tracking-widest flex items-center justify-center gap-xs'>
          <Lock className='w-3.5 h-3.5' />
          Calculations processed securely via API
        </p>
      </div>
    </div>
  );
}
