import React from 'react';

const DownloadOptions = ({ onDownload, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-lg p-8 m-4">
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
          <button onClick={() => onDownload('pdf')} className="w-full flex items-center gap-4 p-5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-primary text-3xl">picture_as_pdf</span>
            <div>
              <h3 className="font-bold text-on-surface text-left">Download as PDF</h3>
              <p className="text-sm text-on-surface-variant text-left">Official, secure, and ready for printing.</p>
            </div>
          </button>
          <button onClick={() => onDownload('excel')} className="w-full flex items-center gap-4 p-5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-green-600 text-3xl">request_quote</span>
            <div>
              <h3 className="font-bold text-on-surface text-left">Download as Excel</h3>
              <p className="text-sm text-on-surface-variant text-left">For personal accounting and data analysis.</p>
            </div>
          </button>
        </div>

        <div className="text-xs text-on-surface-variant/80 text-center">
          <p>In compliance with RBI guidelines, your first statement of the month is free. Subsequent downloads may incur a nominal fee.</p>
        </div>
      </div>
    </div>
  );
};

export default DownloadOptions;
