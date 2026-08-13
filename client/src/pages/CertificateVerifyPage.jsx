import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TournamentHeader from "../components/TournamentHeader";
import CertificateVerificationCard from "../components/CertificateVerificationCard";

export default function CertificateVerifyPage() {
  const { uuid: pathUuid } = useParams();
  const [searchParams] = useSearchParams();
  const queryUuid = searchParams.get("uuid");

  const initialUuid = pathUuid || queryUuid || "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TournamentHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <CertificateVerificationCard initialUuid={initialUuid} />
      </main>
    </div>
  );
}
