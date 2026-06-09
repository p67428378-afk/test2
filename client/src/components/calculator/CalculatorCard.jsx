import React, { useState } from 'react';
import DisplayArea from './DisplayArea.jsx';
import ButtonGrid from './ButtonGrid.jsx';
import { calculate } from '../../services/api.js';

export default function CalculatorCard({ onCalculationSuccess }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [operand1, setOperand1] = useState(null);
  const [operator, setOperator] = useState(null);
  const [shouldResetDisplay, setShouldResetResetDisplay] = useState(false);

  const handleButtonClick = async (value) => {
    if (value >= '0' && value <= '9') {
      if (displayValue === '0' || shouldResetDisplay) {
        setDisplayValue(value);
        setShouldResetResetDisplay(false);
      } else {
        setDisplayValue(displayValue + value);
      }
    } else if (value === '.') {
      if (shouldResetDisplay) {
        setDisplayValue('0.');
        setShouldResetResetDisplay(false);
      } else if (!displayValue.includes('.')) {
        setDisplayValue(displayValue + '.');
      }
    } else if (value === 'C') {
      setDisplayValue('0');
      setExpression('');
      setOperand1(null);
      setOperator(null);
      setShouldResetResetDisplay(false);
    } else if (value === '+/-') {
      if (displayValue !== '0' && displayValue !== 'Error' && displayValue !== 'Cannot divide by zero') {
        if (displayValue.startsWith('-')) {
          setDisplayValue(displayValue.substring(1));
        } else {
          setDisplayValue('-' + displayValue);
        }
      }
    } else if (value === '%') {
      if (displayValue !== 'Error' && displayValue !== 'Cannot divide by zero') {
        const num = parseFloat(displayValue);
        if (!isNaN(num)) {
          setDisplayValue((num / 100).toString());
        }
      }
    } else if (['+', '-', '*', '/'].includes(value)) {
      const currentNum = parseFloat(displayValue);
      if (!isNaN(currentNum)) {
        setOperand1(currentNum);
        setOperator(value);
        const opSymbol = value === '*' ? '×' : value === '/' ? '÷' : value;
        setExpression(`${currentNum} ${opSymbol}`);
        setShouldResetResetDisplay(true);
      }
    } else if (value === '=') {
      if (operator && operand1 !== null) {
        const operand2 = parseFloat(displayValue);
        if (isNaN(operand2)) return;

        // Handle division by zero locally
        if (operator === '/' && operand2 === 0) {
          setDisplayValue('Cannot divide by zero');
          setExpression(`${operand1} ÷ 0`);
          setOperand1(null);
          setOperator(null);
          setShouldResetResetDisplay(true);
          return;
        }

        const opSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
        setExpression(`${operand1} ${opSymbol} ${operand2}`);

        try {
          // Map operator to backend expected values: 'add', 'subtract', 'multiply', 'divide'
          let backendOp = '';
          if (operator === '+') backendOp = 'add';
          else if (operator === '-') backendOp = 'subtract';
          else if (operator === '*') backendOp = 'multiply';
          else if (operator === '/') backendOp = 'divide';

          const data = await calculate(operand1, operand2, backendOp);
          if (data && data.result !== undefined) {
            setDisplayValue(data.result.toString());
            if (onCalculationSuccess) {
              onCalculationSuccess();
            }
          } else {
            setDisplayValue('Error');
          }
        } catch (error) {
          console.error('Calculation error:', error);
          setDisplayValue('Error');
        }
        setOperand1(null);
        setOperator(null);
        setShouldResetResetDisplay(true);
      }
    }
  };

  return (
    <div className='calc-card w-full max-w-container-width shrink-0 mx-auto xl:mx-0'>
      <DisplayArea expression={expression} value={displayValue} />
      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  );
}