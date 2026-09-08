import React, { useState, useEffect, useCallback } from "react";
import AppHeader from "./AppHeader.jsx";
import DisplayBuffer from "./DisplayBuffer.jsx";
import KeypadGrid from "./KeypadGrid.jsx";
import ErrorBanner from "./ErrorBanner.jsx";
import AppFooter from "./AppFooter.jsx";
import { calculateExpression, checkHealth } from "../services/api.js";

export const CalculatorApp = () => {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [history, setHistory] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [justCalculated, setJustCalculated] = useState(false);

  // Check health on initial mount
  useEffect(() => {
    let isMounted = true;
    checkHealth()
      .then((data) => {
        if (isMounted) {
          setIsOnline(data?.status === "healthy" || true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsOnline(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClear = useCallback(() => {
    setExpression("");
    setDisplayValue("0");
    setHistory("");
    setError(null);
    setJustCalculated(false);
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const handleNumber = useCallback(
    (num) => {
      setError(null);

      if (justCalculated) {
        if (num === ".") {
          setExpression("0.");
          setDisplayValue("0.");
        } else {
          setExpression(String(num));
          setDisplayValue(String(num));
        }
        setJustCalculated(false);
        return;
      }

      setExpression((prev) => {
        let nextExpr = prev;

        // Handle decimal point logic
        if (num === ".") {
          // Find last numeric segment after last space
          const segments = prev.split(" ");
          const lastSegment = segments[segments.length - 1];
          if (lastSegment.includes(".")) {
            return prev; // Ignore duplicate decimal in the same number
          }
          if (!lastSegment || lastSegment === "") {
            nextExpr = prev + "0.";
          } else {
            nextExpr = prev + ".";
          }
        } else {
          if (prev === "0") {
            nextExpr = String(num);
          } else {
            nextExpr = prev + String(num);
          }
        }

        setDisplayValue(nextExpr);
        return nextExpr;
      });
    },
    [justCalculated],
  );

  const handleOperator = useCallback(
    (op) => {
      setError(null);

      setExpression((prev) => {
        let currentBase = prev;
        if (justCalculated) {
          setJustCalculated(false);
          currentBase = displayValue;
        }

        if (!currentBase || currentBase.trim() === "") {
          currentBase = "0";
        }

        // If already ends with an operator (e.g. " + ", " - ", " * ", " / ")
        const trimmed = currentBase.trim();
        const lastChar = trimmed.slice(-1);

        if (["+", "-", "*", "/"].includes(lastChar)) {
          // Replace previous operator
          const replaced = trimmed.slice(0, -1).trim() + ` ${op} `;
          setDisplayValue(replaced);
          return replaced;
        }

        const nextExpr = `${trimmed} ${op} `;
        setDisplayValue(nextExpr);
        return nextExpr;
      });
    },
    [justCalculated, displayValue],
  );

  const handleBackspace = useCallback(() => {
    setError(null);

    if (justCalculated) {
      handleClear();
      return;
    }

    setExpression((prev) => {
      if (!prev || prev.length <= 1) {
        setDisplayValue("0");
        return "";
      }

      let updated = prev;
      // If trailing space from operator (e.g., " + ")
      if (updated.endsWith(" ")) {
        updated = updated.trimEnd();
        // Remove the operator char
        updated = updated.slice(0, -1).trimEnd();
      } else {
        updated = updated.slice(0, -1);
      }

      const nextVal = updated.trim() || "0";
      setDisplayValue(nextVal);
      return updated;
    });
  }, [justCalculated, handleClear]);

  const handlePercentage = useCallback(() => {
    setError(null);
    setExpression((prev) => {
      const base = justCalculated ? displayValue : prev;
      if (!base || base.trim() === "" || base === "0") return prev;
      const nextExpr = `${base.trim()} / 100`;
      setDisplayValue(nextExpr);
      setJustCalculated(false);
      return nextExpr;
    });
  }, [justCalculated, displayValue]);

  const handleCalculate = useCallback(async () => {
    const exprToEval = expression.trim();
    if (!exprToEval) return;

    // Strip trailing operator if present
    let cleanExpr = exprToEval;
    const lastChar = cleanExpr.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
      cleanExpr = cleanExpr.slice(0, -1).trim();
    }

    if (!cleanExpr) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await calculateExpression(cleanExpr);
      const computedResult = data.result;
      const formattedResult = Number.isInteger(computedResult)
        ? String(computedResult)
        : String(Number(computedResult.toFixed(8)).toString());

      setHistory(`${cleanExpr} =`);
      setDisplayValue(formattedResult);
      setExpression(formattedResult);
      setJustCalculated(true);
      setError(null);
    } catch (err) {
      const detailMsg =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Calculation error";
      setError(detailMsg);
      // Keep expression visible so user can correct it or clear
    } finally {
      setIsLoading(false);
    }
  }, [expression]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleNumber(key);
      } else if (key === ".") {
        event.preventDefault();
        handleNumber(".");
      } else if (key === "+") {
        event.preventDefault();
        handleOperator("+");
      } else if (key === "-") {
        event.preventDefault();
        handleOperator("-");
      } else if (key === "*") {
        event.preventDefault();
        handleOperator("*");
      } else if (key === "/") {
        event.preventDefault();
        handleOperator("/");
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleCalculate();
      } else if (key === "Backspace") {
        event.preventDefault();
        handleBackspace();
      } else if (key === "Escape" || key.toLowerCase() === "c") {
        event.preventDefault();
        handleClear();
      } else if (key === "%") {
        event.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleNumber,
    handleOperator,
    handleCalculate,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  return (
    <div className="calculator-app bg-slate-50 min-h-screen p-4 sm:p-6 font-sans flex flex-col justify-between">
      <div>
        <AppHeader isOnline={isOnline} />
        <main className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <DisplayBuffer
            history={history}
            currentInput={displayValue}
            isLoading={isLoading}
          />
          <ErrorBanner message={error} onDismiss={handleDismissError} />
          <KeypadGrid
            onNumber={handleNumber}
            onOperator={handleOperator}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onPercentage={handlePercentage}
            onCalculate={handleCalculate}
            isLoading={isLoading}
          />
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default CalculatorApp;
