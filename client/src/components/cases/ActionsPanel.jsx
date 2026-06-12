import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, ShieldAlert, MessageSquare } from 'lucide-react';
import Button from '../common/Button';

export default function ActionsPanel({ currentStatus, onAction, isSubmitting }) {
  const [status, setStatus] = useState(currentStatus || 'REVIEW');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notes.trim()) {
      onAction({ status, notes });
      setNotes('');
    }
  };

  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Compliance Action</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Manual override and audit trail notes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
            Set Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setStatus('APPROVED')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                status === 'APPROVED'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50'
              }`}
            >
              <CheckCircle className="w-6 h-6 mb-2" />
              <span className="font-label-md text-label-md uppercase">Approve</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('REVIEW')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                status === 'REVIEW'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50'
              }`}
            >
              <AlertTriangle className="w-6 h-6 mb-2" />
              <span className="font-label-md text-label-md uppercase">Review</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus('FLAGGED')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                status === 'FLAGGED'
                  ? 'bg-error/10 border-error text-error'
                  : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/50'
              }`}
            >
              <ShieldAlert className="w-6 h-6 mb-2" />
              <span className="font-label-md text-label-md uppercase">Flag</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
            Compliance Notes / Justification
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide detailed reasoning for this status change..."
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-3 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-28 resize-none"
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isSubmitting || !notes.trim()}>
            {isSubmitting ? 'Submitting...' : 'Submit Action'}
          </Button>
        </div>
      </form>
    </div>
  );
}