import React, { useState, useEffect } from 'react';
import { getManuscripts } from '../services/api';
import ManuscriptTable from '../components/manuscript/ManuscriptTable.jsx';
import CoAuthorInviteForm from '../components/manuscript/CoAuthorInviteForm.jsx';
import ComplianceReport from '../components/manuscript/ComplianceReport.jsx';

export default function DashboardPage() {
  const [manuscripts, setManuscripts] = useState([]);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      const data = await getManuscripts();
      setManuscripts(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch manuscripts:', err);
      setError('Failed to load manuscripts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscripts();
  }, []);

  const totalManuscripts = manuscripts.length;
  const underReview = manuscripts.filter(m => m.status?.toLowerCase() === 'under review' || m.status?.toLowerCase() === 'under_review').length;
  const needsRevision = manuscripts.filter(m => m.status?.toLowerCase() === 'needs revision' || m.status?.toLowerCase() === 'needs_revision').length;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-display text-display text-on-surface mb-2'>Dashboard</h1>
        <p className='font-body-lg text-body-lg text-on-surface-variant'>
          Overview of your academic submissions and review processes.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-[#6366F1]/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Total Manuscripts</span>
            <div className='p-2 bg-surface-container-highest rounded-lg text-primary'>
              <span className='material-symbols-outlined'>library_books</span>
            </div>
          </div>
          <div className='font-display text-display font-bold text-on-surface'>{totalManuscripts}</div>
        </div>

        <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-[#6366F1]/50 transition-colors'>
          <div className='flex justify-between items-start mb-4'>
            <span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Under Review</span>
            <div className='p-2 bg-secondary-fixed-dim/20 rounded-lg text-secondary-fixed'>
              <span className='material-symbols-outlined'>hourglass_empty</span>
            </div>
          </div>
          <div className='font-display text-display font-bold text-on-surface'>{underReview}</div>
        </div>

        <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-[#6366F1]/50 transition-colors relative overflow-hidden'>
          <div className='absolute top-0 right-0 w-16 h-16 bg-tertiary-container/10 rounded-bl-full z-0'></div>
          <div className='flex justify-between items-start mb-4 relative z-10'>
            <span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-2'>
              Needs Revision
            </span>
            <div className='p-2 bg-tertiary-container/20 rounded-lg text-tertiary'>
              <span className='material-symbols-outlined'>edit_note</span>
            </div>
          </div>
          <div className='flex items-center gap-3 relative z-10'>
            <div className='font-display text-display font-bold text-on-surface'>{needsRevision}</div>
            {needsRevision > 0 && (
              <span className='bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm px-2 py-1 rounded-full border border-tertiary/30 flex items-center gap-1'>
                <span className='material-symbols-outlined text-[12px]'>warning</span> Action Req
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className='p-4 bg-error-container/20 border border-error/30 rounded-xl text-error flex items-center gap-2'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className='flex items-center justify-center py-12 text-primary gap-2'>
          <span className='material-symbols-outlined animate-spin'>sync</span>
          <span>Loading manuscripts...</span>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            <ManuscriptTable
              manuscripts={manuscripts}
              onSelectManuscript={(ms) => setSelectedManuscript(ms)}
            />
          </div>

          <div className='space-y-6'>
            {selectedManuscript ? (
              <div className='space-y-6'>
                <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm space-y-4'>
                  <div className='flex justify-between items-start'>
                    <h3 className='font-headline-md text-headline-md text-on-surface'>
                      {selectedManuscript.title || 'Untitled Manuscript'}
                    </h3>
                    <button
                      onClick={() => setSelectedManuscript(null)}
                      className='text-on-surface-variant hover:text-on-surface'
                    >
                      <span className='material-symbols-outlined'>close</span>
                    </button>
                  </div>
                  <div>
                    <h4 className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1'>Abstract</h4>
                    <p className='text-sm text-on-surface-variant bg-[#0F172A]/50 p-3 rounded-lg border border-[#334155] max-h-40 overflow-y-auto'>
                      {selectedManuscript.abstract || 'No abstract available.'}
                    </p>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-on-surface-variant'>Status:</span>
                    <span className='font-semibold text-primary capitalize'>{selectedManuscript.status}</span>
                  </div>
                </div>

                <CoAuthorInviteForm manuscriptId={selectedManuscript.manuscript_id} />
                <ComplianceReport manuscriptId={selectedManuscript.manuscript_id} />
              </div>
            ) : (
              <div className='bg-[#1E293B] border border-[#334155] border-dashed rounded-xl p-8 text-center text-on-surface-variant h-full flex flex-col items-center justify-center min-h-[300px]'>
                <span className='material-symbols-outlined text-4xl mb-2'>info</span>
                <p className='text-sm'>Select a manuscript from the table to manage co-authors and run compliance checks.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
