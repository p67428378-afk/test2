import React from 'react';
import { Download, CheckCircle, FileText, ShieldCheck } from 'lucide-react';
import { getDownloadUrl } from '../../services/api';

const DocumentPreview = ({ certificate }) => {
  if (!certificate) return null;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center text-center border-b border-outline-variant pb-6">
        <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Certificate Generated Successfully!</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Your digitally signed account balance certificate is ready for download.
        </p>
      </div>

      {/* Certificate Details Card */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-3">
          <FileText className="text-primary-container w-6 h-6" />
          <span className="font-headline-sm text-headline-sm text-on-surface">Certificate Details</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Request ID</span>
            <span className="font-label-md text-label-md text-on-surface">#{certificate.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <div>
            <span className="block text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Account Number</span>
            <span className="font-label-md text-label-md text-on-surface">{certificate.account_number}</span>
          </div>
          <div>
            <span className="block text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Purpose</span>
            <span className="font-label-md text-label-md text-on-surface capitalize">{certificate.purpose}</span>
          </div>
          <div>
            <span className="block text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">Status</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#047857] font-label-sm text-[11px] border border-[#10B981]/20">
              Success
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Badge */}
      <div className="flex items-start gap-3 p-4 bg-primary-container/5 border border-primary-container/10 rounded-lg">
        <ShieldCheck className="text-primary-container w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-label-md text-label-md text-on-surface font-bold">Legally Compliant & Digitally Signed</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            This certificate is digitally signed in compliance with the IT Act 2000 Digital Signature Provisions and adheres to the RBI Customer Service Guidelines.
          </p>
        </div>
      </div>

      {/* Download Button */}
      <div className="pt-4">
        <a
          href={getDownloadUrl(certificate.id)}
          download
          className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-container/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Download className="w-5 h-5" /> Download PDF Certificate
        </a>
      </div>
    </div>
  );
};

export default DocumentPreview;
