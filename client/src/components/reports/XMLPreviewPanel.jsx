import React from 'react';
import { FileCode, X } from 'lucide-react';
import Button from '../common/Button';

export default function XMLPreviewPanel({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant p-6 space-y-4 flex flex-col h-[500px]">
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">XML Report Preview</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              FIU-IND compliant XML schema for {report.reportType}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-4 overflow-auto font-mono text-xs text-emerald-400 whitespace-pre">
        {report.xmlContent}
      </div>
    </div>
  );
}