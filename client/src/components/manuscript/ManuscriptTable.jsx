import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManuscriptTable({ manuscripts, onSelectManuscript }) {
  const navigate = useNavigate();

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'needs revision':
      case 'needs_revision':
        return 'bg-tertiary-container/10 text-tertiary border border-tertiary/20';
      case 'under review':
      case 'under_review':
        return 'bg-secondary-container/10 text-secondary-fixed border border-secondary-container/20';
      case 'approved':
        return 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20';
      case 'draft':
      default:
        return 'bg-surface-container-high text-on-surface-variant border border-outline-variant';
    }
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-sm flex flex-col'>
      <div className='px-6 py-5 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]/50'>
        <h2 className='font-headline-md text-headline-md text-on-surface'>My Manuscripts</h2>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-[#1E293B] border-b border-[#334155]'>
              <th className='px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>ID</th>
              <th className='px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Title</th>
              <th className='px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Last Updated</th>
              <th className='px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Status</th>
              <th className='px-6 py-4 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='font-body-md text-body-md text-on-surface divide-y divide-[#334155]'>
            {manuscripts.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-6 py-8 text-center text-on-surface-variant italic'>
                  No manuscripts found. Upload one to get started!
                </td>
              </tr>
            ) : (
              manuscripts.map((ms) => (
                <tr key={ms.manuscript_id} className='hover:bg-[#2d3449]/50 transition-colors group'>
                  <td className='px-6 py-4 whitespace-nowrap text-on-surface-variant text-sm'>
                    #{ms.manuscript_id.substring(0, 8)}
                  </td>
                  <td className='px-6 py-4 font-semibold text-on-surface'>
                    {ms.title || 'Untitled Manuscript'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-on-surface-variant'>
                    {new Date(ms.updated_at || ms.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-md text-label-md ${getStatusBadgeClass(ms.status)}`}>
                      {ms.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right'>
                    <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button
                        onClick={() => onSelectManuscript(ms)}
                        className='px-3 py-1 bg-surface-container-low border border-[#334155] rounded text-on-surface hover:bg-surface-variant font-label-sm text-label-sm transition-colors'
                      >
                        Manage
                      </button>
                      {(ms.status?.toLowerCase() === 'needs revision' || ms.status?.toLowerCase() === 'needs_revision') && (
                        <button
                          onClick={() => navigate(`/revisions?id=${ms.manuscript_id}`)}
                          className='px-3 py-1 bg-[#6366F1] text-white rounded hover:bg-opacity-90 font-label-sm text-label-sm transition-colors'
                        >
                          Revisions
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
