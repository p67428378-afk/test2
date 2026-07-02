import React, { useState } from "react";
import TopAppBar from "./components/layout/TopAppBar";
import BottomNavBar from "./components/layout/BottomNavBar";
import FDProductCatalogPage from "./pages/FDProductCatalogPage";
import FDCreationFormPage from "./pages/FDCreationFormPage";
import FDConfirmationPage from "./pages/FDConfirmationPage";
import FDSuccessPage from "./pages/FDSuccessPage";

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [sourceAccount, setSourceAccount] = useState(null);
  const [transactionResult, setTransactionResult] = useState(null);

  const handleReset = () => {
    setStep(1);
    setSelectedProduct(null);
    setDepositAmount("");
    setSourceAccount(null);
    setTransactionResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      <TopAppBar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[500px] flex flex-col justify-between">
          {step === 1 && (
            <FDProductCatalogPage
              onNext={() => setStep(2)}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          )}

          {step === 2 && (
            <FDCreationFormPage
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
              selectedProduct={selectedProduct}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              sourceAccount={sourceAccount}
              setSourceAccount={setSourceAccount}
            />
          )}

          {step === 3 && (
            <FDConfirmationPage
              onBack={() => setStep(2)}
              onSuccess={(result) => {
                setTransactionResult(result);
                setStep(4);
              }}
              selectedProduct={selectedProduct}
              depositAmount={depositAmount}
              sourceAccount={sourceAccount}
            />
          )}

          {step === 4 && (
            <FDSuccessPage result={transactionResult} onDone={handleReset} />
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
