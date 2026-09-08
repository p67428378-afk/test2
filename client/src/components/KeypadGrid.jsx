import React from "react";
import KeypadButton from "./KeypadButton.jsx";

export const KeypadGrid = ({
  onNumber,
  onOperator,
  onClear,
  onBackspace,
  onPercentage,
  onCalculate,
  isLoading = false,
}) => {
  return (
    <div data-testid="keypad-grid" className="keypad grid grid-cols-4 gap-3">
      {/* Row 1 */}
      <KeypadButton
        label="AC"
        variant="ac"
        onClick={onClear}
        disabled={isLoading}
        ariaLabel="All Clear"
      />
      <KeypadButton
        label="⌫"
        variant="slate-op"
        onClick={onBackspace}
        disabled={isLoading}
        ariaLabel="Backspace"
      />
      <KeypadButton
        label="%"
        variant="slate-op"
        onClick={onPercentage}
        disabled={isLoading}
        ariaLabel="Percentage"
      />
      <KeypadButton
        label="÷"
        value="/"
        variant="op"
        onClick={onOperator}
        disabled={isLoading}
        ariaLabel="Divide"
      />

      {/* Row 2 */}
      <KeypadButton
        label="7"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="8"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="9"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="×"
        value="*"
        variant="op"
        onClick={onOperator}
        disabled={isLoading}
        ariaLabel="Multiply"
      />

      {/* Row 3 */}
      <KeypadButton
        label="4"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="5"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="6"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="-"
        value="-"
        variant="op"
        onClick={onOperator}
        disabled={isLoading}
        ariaLabel="Subtract"
      />

      {/* Row 4 */}
      <KeypadButton
        label="1"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="2"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="3"
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="+"
        value="+"
        variant="op"
        onClick={onOperator}
        disabled={isLoading}
        ariaLabel="Add"
      />

      {/* Row 5 */}
      <KeypadButton
        label="0"
        colSpan={2}
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
      />
      <KeypadButton
        label="."
        value="."
        variant="num"
        onClick={onNumber}
        disabled={isLoading}
        ariaLabel="Decimal point"
      />
      <KeypadButton
        label="="
        variant="equals"
        onClick={onCalculate}
        disabled={isLoading}
        ariaLabel="Equals"
      />
    </div>
  );
};

export default KeypadGrid;
