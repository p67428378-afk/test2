import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getManuscripts, getRevisions } from '../services/api';
import CritiqueCard from '../components/manuscript/CritiqueCard.jsx';

export default function RevisionPage() {
  const [searchParams] = useSearchParams();
  const manuscriptIdFromUrl = searchParams.get('id');

  const [manuscripts, setManuscripts] = useState([]);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState(manuscriptIdFromUrl || '');
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        const data = await getManuscripts();
        // Filter to only those that need revision or under review
        const revisionNeeded = data.filter(
          m => m.status?.toLowerCase() === 'needs revision' || m.status?.toLowerCase() === 'needs_revision'
        );
        setManuscripts(revisionNeeded);
        if (revisionNeeded.length > 0 && !selectedManuscriptId) {
          setSelectedManuscriptId(revisionNeeded[0].manuscript_id);
        }
      } catch (err) {
        console.error('Failed to fetch manuscripts:', err);
      }
    };
    fetchManuscripts();
  }, [selectedManuscriptId]);

  const fetchRevisions = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRevisions(id);
      setRevisions(data);
    } catch (err) {
      console.error('Failed to fetch revisions:', err);
      setError('Failed to load reviewer critiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedManuscriptId) {
      fetchRevisions(selectedManuscriptId);
    }
  }, [selectedManuscriptId]);

  const handleRebuttalSuccess = (updatedRevision) => {
    setRevisions(prev =>
      prev.map(r => r.revision_id === updatedRevision.revision_id ? updatedRevision : r)
    );
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div>
        <h1 className='font-display text-display text-on-surface mb-2'>Interactive Revision Dashboard</h1>
        <p className='font-body-lg text-body-lg text-on-surface-variant'>
          Address reviewer critiques and submit point-by-point rebuttals.
        </p>
      </div>

      <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm'>
        <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
          Select Manuscript Needing Revision
        </label>
        <select
          value={selectedManuscriptId}
          onChange={(e) => setSelectedManuscriptId(e.target.value)}
          className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]'
        >
          <option value=''>-- Select a Manuscript --</option>
          {manuscripts.map((m) => (
            <option key={m.manuscript_id} value={m.manuscript_id}>
              {m.title || 'Untitled Manuscript'} (#{m.manuscript_id.substring(0, 8)})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-12 text-primary gap-2'>
          <span className='material-symbols-outlined animate-spin'>sync</span>
          <span>Loading critiques...</span>
        </div>
      ) : error ? (
        <div className='p-4 bg-error-container/20 border border-error/30 rounded-xl text-error flex items-center gap-2'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      ) : selectedManuscriptId ? (
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='font-headline-md text-headline-md text-on-surface'>
              Reviewer Critiques ({revisions.length})
            </h3>
          </div>

          {revisions.length === 0 ? (
            <div className='bg-[#1E293B] border border-[#334155] border-dashed rounded-xl p-8 text-center text-on-surface-variant'>
              <span className='material-symbols-outlined text-4xl mb-2'>check_circle</span>
              <p className='text-sm'>No critiques found for this manuscript. You are all set!</p>
            </div>
          ) : (
            <div className='space-y-6'>
              {revisions.map((rev) => (
                <CritiqueCard
                  key={rev.revision_id}
                  manuscriptId={selectedManuscriptId}
                  revision={rev}
                  onRebuttalSuccess={handleRebuttalSuccess}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className='bg-[#1E293B] border border-[#334155] border-dashed rounded-xl p-8 text-center text-on-surface-variant'>
          <span className='material-symbols-outlined text-4xl mb-2'>info</span>
          <p className='text-sm'>Please select a manuscript to view reviewer critiques.</p>
        </div>
      )}
    </div>
  );
}
