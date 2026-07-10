import React, { useState } from "react";
import { vaultService } from "../services/api";

const ImportExportPage = () => {
  const [csvData, setCsvData] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [exportResult, setExportResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async (e) => {
    e.preventDefault();
    setError("");
    setImportResult(null);
    if (!csvData.trim()) {
      setError("Please paste CSV data to import.");
      return;
    }
    setLoading(true);
    try {
      const res = await vaultService.importVault(csvData);
      setImportResult(res);
      setCsvData("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to import CSV data. Ensure correct format.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await vaultService.exportVault();
      setExportResult(res.csv_data);
    } catch (err) {
      console.error(err);
      setError("Failed to export vault data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportResult], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "shieldvault_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-[#4edea3]">
          Data Import & Export
        </h2>
        <p className="text-sm text-[#bbcabf]">
          Backup your vault or migrate credentials from other password managers.
        </p>
      </div>

      {error && (
        <div className="bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] p-3 rounded-lg text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="bg-[#171f33] border border-[#3c4a42] rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#dae2fd] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3]">
                publish
              </span>
              Import Credentials
            </h3>
            <p className="text-xs text-[#bbcabf] mb-4">
              Paste CSV data below. Format:{" "}
              <code className="text-[#4edea3]">
                title,url,username,password,notes
              </code>
            </p>

            <form onSubmit={handleImport} className="space-y-4">
              <textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                rows="8"
                className="w-full bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 text-xs font-mono text-[#dae2fd] focus:outline-none focus:border-[#4edea3] focus:ring-1 focus:ring-[#4edea3] resize-none"
                placeholder="Google Account,https://google.com,alex.mercer@gmail.com,supersecretpassword123!,Backup codes in desk drawer"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4edea3] text-[#003824] font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  upload_file
                </span>
                Import CSV Data
              </button>
            </form>

            {importResult && (
              <div className="mt-4 bg-[#4edea3]/10 border border-[#4edea3]/20 text-[#4edea3] p-3 rounded-lg text-xs space-y-1">
                <p className="font-semibold">{importResult.detail}</p>
                <p>
                  Imported{" "}
                  <span className="font-bold">
                    {importResult.imported_count}
                  </span>{" "}
                  credentials successfully.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-[#171f33] border border-[#3c4a42] rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#dae2fd] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3]">
                download
              </span>
              Export Vault
            </h3>
            <p className="text-xs text-[#bbcabf] mb-4">
              Export your credentials to an unencrypted CSV format for backup.
              Keep this file secure!
            </p>

            <div className="space-y-4">
              {exportResult ? (
                <>
                  <textarea
                    value={exportResult}
                    readOnly
                    rows="8"
                    className="w-full bg-[#0b1326] border border-[#3c4a42] rounded-lg p-2.5 text-xs font-mono text-[#dae2fd] focus:outline-none resize-none"
                  />
                  <button
                    onClick={handleDownloadExport}
                    className="w-full bg-[#4edea3] text-[#003824] font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">
                      download_for_offline
                    </span>
                    Download CSV File
                  </button>
                </>
              ) : (
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="w-full border border-[#3c4a42] text-[#dae2fd] font-semibold py-2 rounded-lg hover:bg-[#222a3d] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">
                    vpn_key
                  </span>
                  Generate Export Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;
