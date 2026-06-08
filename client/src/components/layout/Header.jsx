import React, { useState } from 'react';
import { downloadParliamentaryReport } from '../../services/api';

export default function Header({ title, subtitle }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const data = await downloadParliamentaryReport();
      if (data && data.pdf_binary_stream) {
        // Create a download link for the base64 PDF
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${data.pdf_binary_stream}`;
        link.download = `Parliamentary_Fiscal_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('No PDF data returned');
      }
    } catch (err) {
      console.error('Failed to download report:', err);
      setError('Failed to download report. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className='h-16 flex justify-between items-center px-lg z-40 bg-surface-container border-b border-outline-variant shadow-sm shrink-0'>
      {/* Left: Title & Subtitle */}
      <div className='flex items-center gap-md'>
        <div>
          <h2 className='text-headline-lg font-headline-lg font-semibold text-on-surface leading-none'>{title}</h2>
        </div>
        <div className='h-6 w-px bg-outline-variant mx-sm'></div>
        <p className='text-body-md font-body-md text-on-surface-variant hidden lg:block'>{subtitle}</p>
      </div>

      {/* Right: Search & Actions */}
      <div className='flex items-center gap-lg'>
        {/* Search */}
        <div className='relative hidden md:block w-64'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]'>search</span>
          <input
            className='w-full bg-surface-variant border border-outline-variant rounded py-1.5 pl-10 pr-3 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline'
            placeholder="Search metrics..."
            type="text"
          />
        </div>

        {/* Actions */}
        <div className='flex items-center gap-md'>
          {/* Notifications */}
          <button className='relative p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-variant'>
            <span className='material-symbols-outlined'>notifications</span>
            <span className='absolute top-0 right-0 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container'></span>
          </button>

          {/* CTA */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className='hidden lg:flex items-center gap-sm bg-inverse-primary text-white px-lg py-2.5 rounded hover:bg-opacity-90 transition-opacity text-label-md font-label-md uppercase disabled:opacity-50'
          >
            <span className='material-symbols-outlined text-[18px]'>download</span>
            {downloading ? 'Generating...' : 'Download Parliamentary Report'}
          </button>
        </div>
      </div>
      {error && (
        <div className='absolute top-16 right-4 bg-error-container text-on-error-container p-sm rounded shadow-lg z-50 text-body-md'>
          {error}
        </div>
      )}
    </header>
  );
}
