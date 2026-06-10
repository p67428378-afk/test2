import React, { useState } from 'react';
import DisplayScreen from './DisplayScreen';
import Button from '../common/Button';
import { calculate } from '../../services/api';

export default function CalculatorCard({ onCalculationSuccess }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);
  const [isResetOnNextInput, setIsResetOnNextInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num) => {
    if (displayValue === '0' || isResetOnNextInput) {
      setDisplayValue(num);
      setIsResetOnNextInput(false);
    } else {
      setDisplayValue(displayValue + num);
    }
  };

  const handleDecimalClick = () => {
    if (isResetOnNextInput) {
      setDisplayValue('0.');
      setIsResetOnNextInput(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleClear = () => {
    setDisplayValue('0');
    setExpression('');
    setOperand1(null);
    setOperator(null);
    setIsResetOnNextInput(false);
  };

  const handleToggleSign = () => {
    if (displayValue === '0' || displayValue === 'Error') return;
    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.substring(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  };

  const handlePercent = () => {
    if (displayValue === '0' || displayValue === 'Error') return;
    const val = parseFloat(displayValue) / 100;
    setDisplayValue(String(val));
  };

  const handleOperatorClick = (op) => {
    if (displayValue === 'Error') return;
    const currentVal = parseFloat(displayValue);
    setOperand1(currentVal);
    setOperator(op);
    setExpression(`${currentVal} ${op}`);
    setIsResetOnNextInput(true);
  };

  const handleEqualClick = async () => {
    if (operand1 === null || !operator || displayValue === 'Error') return;
    const currentVal = parseFloat(displayValue);
    
    // Client-side check for division by zero
    if (operator === '/' && currentVal === 0) {
      setDisplayValue('Error');
      setExpression(`${operand1} / 0`);
      setOperand1(null);
      setOperator(null);
      setIsResetOnNextInput(true);
      return;
    }

    setLoading(true);
    try {
      const data = await calculate(operand1, currentVal, operator);
      const result = data.result;
      setDisplayValue(String(result));
      setExpression(`${operand1} ${operator} ${currentVal}`);
      
      // Notify parent to add to history
      if (onCalculationSuccess) {
        onCalculationSuccess({
          operand1,
          operand2: currentVal,
          operator,
          result,
          time: 'Just now'
        });
      }
      
      setOperand1(null);
      setOperator(null);
      setIsResetOnNextInput(true);
    } catch (err) {
      setDisplayValue('Error');
      setExpression('Error');
      setOperand1(null);
      setOperator(null);
      setIsResetOnNextInput(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full md:w-[60%] flex flex-col'>
      <div className='bg-surface-bright border border-outline-variant rounded-xl p-container-padding flex-grow flex flex-col shadow-lg'>
        <DisplayScreen expression={expression} value={loading ? 'Calculating...' : displayValue} />
        
        <div className='grid grid-cols-4 gap-button-gap flex-grow'>
          {/* Row 1 */}
          <Button
            onClick={handleClear}
            className='bg-surface border border-error text-error hover:bg-surface-variant active:bg-surface-container-high'
          >
            C
          </Button>
          <Button
            onClick={handleToggleSign}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            +/-
          </Button>
          <Button
            onClick={handlePercent}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            %
          </Button>
          <Button
            onClick={() => handleOperatorClick('/')}
            className='bg-surface border border-outline-variant text-primary hover:bg-surface-variant active:bg-surface-container-high'
          >
            /
          </Button>

          {/* Row 2 */}
          <Button
            onClick={() => handleNumberClick('7')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            7
          </Button>
          <Button
            onClick={() => handleNumberClick('8')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            8
          </Button>
          <Button
            onClick={() => handleNumberClick('9')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            9
          </Button>
          <Button
            onClick={() => handleOperatorClick('*')}
            className='bg-surface border border-outline-variant text-primary hover:bg-surface-variant active:bg-surface-container-high'
          >
            *
          </Button>

          {/* Row 3 */}
          <Button
            onClick={() => handleNumberClick('4')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            4
          </Button>
          <Button
            onClick={() => handleNumberClick('5')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            5
          </Button>
          <Button
            onClick={() => handleNumberClick('6')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            6
          </Button>
          <Button
            onClick={() => handleOperatorClick('-')}
            className='bg-surface border border-outline-variant text-primary hover:bg-surface-variant active:bg-surface-container-high'
          >
            -
          </Button>

          {/* Row 4 */}
          <Button
            onClick={() => handleNumberClick('1')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            1
          </Button>
          <Button
            onClick={() => handleNumberClick('2')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            2
          </Button>
          <Button
            onClick={() => handleNumberClick('3')}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            3
          </Button>
          <Button
            onClick={() => handleOperatorClick('+')}
            className='bg-surface border border-outline-variant text-primary hover:bg-surface-variant active:bg-surface-container-high'
          >
            +
          </Button>

          {/* Row 5 */}
          <Button
            onClick={() => handleNumberClick('0')}
            colSpan={2}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            0
          </Button>
          <Button
            onClick={handleDecimalClick}
            className='bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant active:bg-surface-container-high'
          >
            .
          </Button>
          <Button
            onClick={handleEqualClick}
            className='bg-primary text-on-primary hover:opacity-90 active:opacity-80'
          >
            =
          </Button>
        </div>
      </div>
    </div>
  );
}