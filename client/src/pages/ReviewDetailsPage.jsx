import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReviewDetails } from '../services/api';
import CodeViewer from '../components/reviews/CodeViewer';
import IssuesList from '../components/reviews/IssuesList';

export default function ReviewDetailsPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    const fetchReviewDetails = async () => {
      try {
        const data = await getReviewDetails(id);
        setReview(data);
        if (data.issues && data.issues.length > 0) {
          setSelectedIssue(data.issues[0]);
        }
      } catch (err) {
        console.error("Error fetching review details", err);
        setError("Failed to load review details. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Loading review details...
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="p-6 space-y-4">
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span className="text-xs font-medium">{error || 'Review not found'}</span>
        </div>
        <Link to="/" className="text-primary hover:underline text-sm font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </Link>
            <h2 className="font-sans text-xl font-bold text-on-surface">
              Review Details: PR #{review.pr_id}
            </h2>
          </div>
          <p className="font-sans text-xs text-on-surface-variant">
            Repository: <span className="font-mono">{review.repo_name}</span> | Branch: <span className="font-mono">{review.branch_name || 'main'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-tighter ${
            review.status === 'APPROVED'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-error/10 text-error border-error/20'
          }`}>
            {review.status}
          </span>
          <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-3 py-1.5 rounded-lg">
            Scan Duration: {review.scan_duration_seconds || 0}s
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Issues List */}
        <div className="lg:col-span-4 space-y-4">
          <IssuesList
            issues={review.issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            selectedIssueId={selectedIssue?.issue_id}
          />
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 space-y-4">
          {selectedIssue ? (
            <CodeViewer
              filePath={selectedIssue.file_path}
              issues={review.issues.filter(i => i.file_path === selectedIssue.file_path)}
            />
          ) : (
            <div className="glass-card rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">code</span>
              <h3 className="font-sans font-semibold text-on-surface">No File Selected</h3>
              <p className="font-sans text-xs text-on-surface-variant max-w-xs">
                Select an issue from the list to view the corresponding code and inline findings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
