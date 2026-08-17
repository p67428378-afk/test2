import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import ClaimsTable from "../components/lost-found/ClaimsTable";
import ChatWindow from "../components/lost-found/ChatWindow";
import {
  getClaims,
  getItems,
  verifyClaim,
  getClaimMessages,
  createClaimMessage,
} from "../services/api";

export default function AdminVerifyPage() {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [activeClaimId, setActiveClaimId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [claimsData, itemsData] = await Promise.all([
        getClaims(),
        getItems(),
      ]);
      // Filter to only pending claims for verification
      setClaims(claimsData.filter((c) => c.status === "pending"));
      setItems(itemsData);
    } catch (err) {
      setError("Failed to load claims data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (claimId, status) => {
    try {
      setIsLoading(true);
      await verifyClaim(claimId, status);
      alert(`Claim successfully ${status}!`);
      fetchData();
    } catch (err) {
      alert("Failed to verify claim.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChat = async (claimId) => {
    try {
      setIsLoading(true);
      const messages = await getClaimMessages(claimId);
      setChatMessages(messages);
      setActiveClaimId(claimId);
      setChatOpen(true);
    } catch (err) {
      alert("Failed to load chat messages.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!activeClaimId) return;
    try {
      const newMsg = await createClaimMessage(activeClaimId, text);
      setChatMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <AppLayout title="Verify Claims">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <ClaimsTable
          claims={claims}
          items={items}
          onVerify={handleVerify}
          onOpenChat={handleOpenChat}
        />

        {isChatOpen && activeClaimId && (
          <ChatWindow
            claimId={activeClaimId}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClose={() => setChatOpen(false)}
            isLoading={isLoading}
          />
        )}
      </div>
    </AppLayout>
  );
}
