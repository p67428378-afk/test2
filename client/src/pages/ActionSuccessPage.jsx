import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Ban, ShieldCheck } from "lucide-react";

export default function ActionSuccessPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const id = searchParams.get("id");

  const isApproved = status === "approved";

  return (
    <main className="flex-grow flex items-center justify-center p-margin-desktop bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high/40 via-background to-background">
      <div className="w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-xl p-md text-center shadow-lg">
        {isApproved ? (
          <>
            <div className="w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center border border-primary-container/20 text-primary mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
              Transaction Approved
            </h2>
            <p className="text-on-surface-variant text-body-md mb-6">
              You have successfully authorized this transaction. No further
              action is required.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 mx-auto mb-4">
              <Ban className="w-8 h-8" />
            </div>
            <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
              Transaction Blocked
            </h2>
            <p className="text-on-surface-variant text-body-md mb-6">
              This transaction has been blocked, and your card has been
              temporarily suspended to prevent further unauthorized activity.
              Our fraud team will contact you shortly.
            </p>
          </>
        )}

        <div className="border-t border-[#334155] pt-md mt-md flex flex-col gap-sm">
          <div className="flex items-center justify-center gap-xs text-outline font-label-md text-label-md">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Securely Processed</span>
          </div>
          {id && (
            <p className="text-outline text-[12px] font-label-md uppercase tracking-wider">
              Reference ID: {id.substring(0, 8).toUpperCase()}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
