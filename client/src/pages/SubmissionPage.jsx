import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploadZone from '../components/manuscript/FileUploadZone.jsx';
import { updateManuscriptDetails } from '../services/api';

export default function SubmissionPage() {
  const navigate = useNavigate();
  const [uploadedManuscript, setUploadedManuscript] = useState(null);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (manuscript) => {
    setUploadedManuscript(manuscript);
    setTitle(manuscript.title || '');
    setAbstract(manuscript.abstract || '');
  };

  const handleSaveMetadata = async (e) => {
    e.preventDefault();
    if (!uploadedManuscript) return;

    setSaving(true);
    setError(null);

    try {
      await updateManuscriptDetails(uploadedManuscript.manuscript_id, {
        title,
        abstract,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save manuscript details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <div>
        <h1 className='font-display text-display text-on-surface mb-2'>New Submission</h1>
        <p className='font-body-lg text-body-lg text-on-surface-variant'>
          Submit your research paper and verify extracted metadata.
        </p>
      </div>

      {!uploadedManuscript ? (
        <FileUploadZone onUploadSuccess={handleUploadSuccess} />
      ) : (
        <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm space-y-6'>
          <div className='flex items-center gap-3 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-[#34d399]'>
            <span className='material-symbols-outlined text-3xl'>check_circle</span>
            <div>
              <h4 className='font-bold'>Manuscript Uploaded Successfully!</h4>
              <p className='text-xs text-on-surface-variant'>
                We have automatically extracted the metadata below. Please review and correct any errors.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveMetadata} className='space-y-4'>
            <div>
              <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
                Extracted Title
              </label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]'
                required
              />
            </div>

            <div>
              <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
                Extracted Abstract
              </label>
              <textarea
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                rows='6'
                className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]'
                required
              />
            </div>

            {error && (
              <div className='p-3 bg-error-container/20 border border-error/30 rounded-lg text-error flex items-center gap-2 text-sm'>
                <span className='material-symbols-outlined'>error</span>
                <span>{error}</span>
              </div>
            )}

            <div className='flex justify-end gap-4 pt-4 border-t border-[#334155]'>
              <button
                type='button'
                onClick={() => setUploadedManuscript(null)}
                className='px-4 py-2 bg-surface-container-low border border-[#334155] rounded-lg text-on-surface hover:bg-surface-variant font-semibold transition-colors'
              >
                Upload Different File
              </button>
              <button
                type='submit'
                disabled={saving}
                className='bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50'
              >
                {saving ? (
                  <>
                    <span className='material-symbols-outlined animate-spin'>sync</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className='material-symbols-outlined'>save</span>
                    <span>Save & Submit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
