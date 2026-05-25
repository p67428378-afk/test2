
import React from 'react';

const DownloadOptions = ({ onDownload, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-lg p-8 m-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-headline font-bold text-2xl text-on-surface">Download Statement</h2>
            <p className="text-on-surface-variant mt-1">Select your preferred file format.</p>
          </div>
          <button onClick={onCancel} className="text-on-surface-variant hover:bg-surface-container rounded-full p-2 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <div onClick={() => onDownload('pdf')} className="group relative bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_32px_rgba(25,28,30,0.04)] transition-all active:scale-[0.98] cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex gap-5">
                <div className="h-14 w-14 bg-error-container/10 flex items-center justify-center rounded-lg text-error">
                  <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Download as PDF</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Official Document for auditing and tax filing. Includes digital signature.</p>
                </div>
              </div>
              <div className="h-6 w-6 border-2 border-outline-variant rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                <div className="h-3 w-3 bg-primary rounded-full opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
          </div>
          <div onClick={() => onDownload('excel')} className="group relative bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_32px_rgba(25,28,30,0.04)] transition-all active:scale-[0.98] cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex gap-5">
                <div className="h-14 w-14 bg-on-primary-fixed/5 flex items-center justify-center rounded-lg text-primary">
                  <span className="material-symbols-outlined text-4xl">table_chart</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline font-bold text-lg text-on-surface">Export to Excel</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Data Analysis format. Ideal for personal budgeting and wealth tracking.</p>
                </div>
              </div>
              <div className="h-6 w-6 border-2 border-outline-variant rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                <div className="h-3 w-3 bg-primary rounded-full opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-on-surface-variant/80 text-center">
          <p>In compliance with RBI guidelines, your first statement of the month is free. Subsequent downloads may incur a nominal fee.</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions;
