import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardPage from "./pages/DashboardPage";
import AnimalsPage from "./pages/AnimalsPage";
import MapPage from "./pages/MapPage";
import Badge from "./components/common/Badge";
import Button from "./components/common/Button";
import { X, Compass, Heart, QrCode, ScanLine } from "lucide-react";

const App = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState("");

  // Simulate QR Code Scanning
  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult("");
    setTimeout(() => {
      // Simulate scanning a valid QR code (e.g., Simba's QR code)
      setScanResult("Simba scanned successfully!");
      setIsScanning(false);
    }, 2000);
  };

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header title="Zoo Visitor App" />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <Routes>
              <Route
                path="/"
                element={<DashboardPage onSelectAnimal={setSelectedAnimal} />}
              />
              <Route
                path="/animals"
                element={<AnimalsPage onSelectAnimal={setSelectedAnimal} />}
              />
              <Route
                path="/map"
                element={<MapPage onSelectAnimal={setSelectedAnimal} />}
              />
            </Routes>
          </main>
        </div>

        {/* Animal Detail Modal */}
        {selectedAnimal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {selectedAnimal.name}
                  </h3>
                  <p className="text-sm text-slate-500 italic">
                    {selectedAnimal.species}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAnimal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Image & Status */}
                <div className="h-64 bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                  {selectedAnimal.image_url ? (
                    <img
                      src={selectedAnimal.image_url}
                      alt={selectedAnimal.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <Compass className="w-16 h-16 mb-2 stroke-1" />
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant="success">{selectedAnimal.status}</Badge>
                    {selectedAnimal.conservation_status && (
                      <Badge
                        variant={
                          selectedAnimal.conservation_status.toLowerCase() ===
                          "endangered"
                            ? "error"
                            : "neutral"
                        }
                      >
                        {selectedAnimal.conservation_status}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Habitat
                      </h4>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedAnimal.habitat ||
                          "No habitat details available."}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Diet
                      </h4>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {selectedAnimal.diet || "No diet details available."}
                      </p>
                    </div>
                  </div>

                  {/* QR Code Integration */}
                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-slate-50/50">
                    <QrCode className="w-16 h-16 text-slate-700 mb-2 stroke-1" />
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Enclosure QR Code
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      Scan this code at the enclosure to view this animal's
                      profile instantly.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm mb-3">
                      {/* Simulated QR Code */}
                      <div className="w-24 h-24 bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 rounded">
                        <span className="text-[10px] font-mono text-slate-500">
                          {selectedAnimal.qr_code || "ZOO-QR"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="text-xs py-1.5 px-3 flex items-center gap-1.5"
                      onClick={handleSimulateScan}
                      disabled={isScanning}
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      {isScanning ? "Scanning..." : "Simulate Scan"}
                    </Button>
                    {scanResult && (
                      <p className="text-xs text-emerald-600 font-semibold mt-2">
                        {scanResult}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setSelectedAnimal(null)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
