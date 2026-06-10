import React, { useState, useEffect } from 'react';
import { inviteCollaborator, getCollaborators } from '../../services/api';

export default function CoAuthorInviteForm({ manuscriptId }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('co-author');
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchCollaborators = async () => {
    try {
      const data = await getCollaborators(manuscriptId);
      setCollaborators(data);
    } catch (err) {
      console.error('Failed to fetch collaborators:', err);
    }
  };

  useEffect(() => {
    if (manuscriptId) {
      fetchCollaborators();
    }
  }, [manuscriptId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await inviteCollaborator(manuscriptId, email, role);
      setEmail('');
      setSuccess(true);
      fetchCollaborators();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to invite collaborator.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-sm'>
      <h3 className='font-headline-md text-headline-md text-on-surface mb-4'>Co-Author Collaboration</h3>
      
      <form onSubmit={handleSubmit} className='space-y-4 mb-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2'>
            <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='coauthor@university.edu'
              className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]'
              required
            />
          </div>
          <div>
            <label className='block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-lg py-2 px-3 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]'
            >
              <option value='co-author'>Co-Author</option>
              <option value='reviewer'>Reviewer</option>
              <option value='editor'>Editor</option>
            </select>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50'
        >
          {loading ? (
            <>
              <span className='material-symbols-outlined animate-spin'>sync</span>
              <span>Sending Invitation...</span>
            </>
          ) : (
            <>
              <span className='material-symbols-outlined'>person_add</span>
              <span>Invite Collaborator</span>
            </>
          )}
        </button>
      </form>

      {success && (
        <div className='mb-4 p-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg text-[#34d399] flex items-center gap-2 text-sm'>
          <span className='material-symbols-outlined'>check_circle</span>
          <span>Invitation sent successfully!</span>
        </div>
      )}

      {error && (
        <div className='mb-4 p-3 bg-error-container/20 border border-error/30 rounded-lg text-error flex items-center gap-2 text-sm'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      )}

      <div>
        <h4 className='font-semibold text-on-surface mb-3 text-sm uppercase tracking-wider text-on-surface-variant'>
          Current Collaborators ({collaborators.length})
        </h4>
        {collaborators.length === 0 ? (
          <p className='text-on-surface-variant text-sm italic'>No collaborators invited yet.</p>
        ) : (
          <div className='divide-y divide-[#334155]'>
            {collaborators.map((collab) => (
              <div key={collab.author_id} className='py-3 flex justify-between items-center'>
                <div>
                  <p className='text-on-surface font-medium text-sm'>{collab.email}</p>
                  <p className='text-xs text-on-surface-variant capitalize'>{collab.role}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  collab.status === 'pending'
                    ? 'bg-tertiary-container/10 text-tertiary border border-tertiary/20'
                    : 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20'
                }`}>
                  {collab.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
