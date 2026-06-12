import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function SanctionsScreeningCard({
  screeningResults = [],
  onRunScreening,
  isScreening,
}) {
  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Sanctions &amp; PEP Screening</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time screening against global watchlists</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={onRunScreening}
          disabled={isScreening}
        >
          {isScreening ? 'Screening...' : 'Run Screening'}
        </Button>
      </div>

      <div className="space-y-3">
        {screeningResults.length === 0 ? (
          <div className="text-center py-6 text-on-surface-variant bg-surface-container-low rounded-lg border border-outline-variant/30">
            No screening results available. Click "Run Screening" to perform checks.
          </div>
        ) : (
          screeningResults.map((result) => {
            const isMatch = result.matchStatus === 'MATCH';
            return (
              <div
                key={result.watchlist}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-colors ${
                  isMatch
                    ? 'bg-error/5 border-error/30 hover:border-error/50'
                    : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isMatch ? (
                    <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">{result.watchlist}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {result.reason || 'No match found.'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0 mt-2 sm:mt-0">
                  <span
                    className={`px-2 py-1 rounded-sm font-label-md text-[10px] uppercase tracking-wider ${
                      isMatch
                        ? 'bg-error/10 text-error border border-error/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {result.matchStatus}
                  </span>
                  {isMatch && (
                    <span className="font-mono-data text-mono-data text-error text-xs">
                      Confidence: {(result.confidenceScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}