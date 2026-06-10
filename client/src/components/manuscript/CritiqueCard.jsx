import React, { useState } from 'react';
import { submitRebuttal } from '../../services/api';

export default function CritiqueCard({ manuscriptId, revision, onRebuttalSuccess }) {
  const [rebuttal, setRebuttal] = useState(revision.author_rebuttal || '');
  const [textLink, setTextLink] = useState(revision.text_link || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rebuttal.trim()) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await submitRebuttal(manuscriptId, revision.revision_id, rebuttal, textLink);
      setSuccess(true);
      onRebuttalSuccess(updated);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to submit rebuttal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm space-y-4'>
      <div className='flex items-start gap-3'>
        <div className='p-2 bg-surface-container-highest rounded-lg text-primary mt-1'>
          <span className='material-symbols-outlined'>rate_review</span>
        </div>
        <div className='flex-1'>
          <h4 className='font-semibold text-on-surface text-sm uppercase tracking-wider text-on-surface-variant mb-1'>
            Reviewer Critique
          </h4>
          <p className='text-on-surface text-sm bg-[#0F172A]/50 p-4 rounded-lg border border-[#334155] italic'>
            "{revision.reviewer_comment}"
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4 pt-2 border-t border-[#334155]'>
        <div>
          <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
            Author Rebuttal / Response
          </label>
          <textarea
            value={rebuttal}
            onChange={(e) => setRebuttal(e.target.value)}
            placeholder='Provide your point-by-point rebuttal or explanation of changes...'
            rows='4'
            className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] text-sm'
            required
          />
        </div>

        <div>
          <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
            Text Link / Reference (Optional)
          </label>
          <input
            type='text'
            value={textLink}
            onChange={(e) => setTextLink(e.target.value)}
            placeholder='e.g., Section 3.2, Page 5'
            className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] text-sm'
          />
        </div>

        <div className='flex items-center justify-between gap-4'>
          <div className='flex-1'>
            {success && (
              <p className='text-[#34d399] text-xs flex items-center gap-1'>
                <span className='material-symbols-outlined text-sm'>check_circle</span>
                Rebuttal saved successfully!
              </p>
            )}
            {error && (
              <p className='text-error text-xs flex items-center gap-1'>
                <span className='material-symbols-outlined text-sm'>error</span>
                {error}
              </p>
            )}
          </div>
          <button
            type='submit'
            disabled={submitting || !rebuttal.trim()}
            className='bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 text-sm'
          >
            {submitting ? (
              <>
                <span className='material-symbols-outlined animate-spin text-sm'>sync</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className='material-symbols-outlined text-sm'>save</span>
                <span>Save Rebuttal</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
