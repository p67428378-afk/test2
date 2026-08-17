import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import ItemList from "../components/lost-found/ItemList";
import MatchList from "../components/lost-found/MatchList";
import ChatWindow from "../components/lost-found/ChatWindow";
import {
  getItems,
  getItemMatches,
  createClaim,
  getClaimMessages,
  createClaimMessage,
} from "../services/api";
import {
  ClipboardList,
  HelpCircle,
  CheckCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [viewingMatches, setViewingMatches] = useState(false);
  const [activeClaimId, setActiveClaimId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = localStorage.getItem("user_email") || "User";

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError("Failed to load items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleClaim = async (itemId) => {
    try {
      setIsLoading(true);
      const claim = await createClaim(itemId);
      alert(
        "Claim submitted successfully! An administrator will verify your ownership.",
      );
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit claim.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMatches = async (itemId) => {
    try {
      setIsLoading(true);
      const data = await getItemMatches(itemId);
      setMatches(data);
      setSelectedItemId(itemId);
      setViewingMatches(true);
    } catch (err) {
      alert("Failed to fetch AI matches.");
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

  // Calculate stats
  const totalReported = items.length;
  const lostCount = items.filter((i) => item_type_is_lost(i)).length;
  const foundCount = items.filter((i) => item_type_is_found(i)).length;
  const returnedCount = items.filter((i) => i.status === "returned").length;

  function item_type_is_lost(item) {
    return item.item_type === "lost";
  }

  function item_type_is_found(item) {
    return item.item_type === "found";
  }

  const selectedItem = items.find((i) => i.id === selectedItemId);

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-semibold text-sm">
                Total Reported
              </span>
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div className="font-bold text-3xl text-gray-900 mt-4">
              {totalReported}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              All lost & found items
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-semibold text-sm">
                Lost Items
              </span>
              <HelpCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="font-bold text-3xl text-red-600 mt-4">
              {lostCount}
            </div>
            <div className="text-xs text-gray-400 mt-1">Awaiting recovery</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-semibold text-sm">
                Found Items
              </span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="font-bold text-3xl text-green-600 mt-4">
              {foundCount}
            </div>
            <div className="text-xs text-gray-400 mt-1">Awaiting claims</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-gray-500 font-semibold text-sm">
                Returned Items
              </span>
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div className="font-bold text-3xl text-purple-600 mt-4">
              {returnedCount}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Successfully reunited
            </div>
          </div>
        </section>

        {/* Main Content */}
        {viewingMatches ? (
          <MatchList
            matches={matches}
            itemCategory={selectedItem?.category || ""}
            onBack={() => setViewingMatches(false)}
            onClaim={handleClaim}
          />
        ) : (
          <ItemList
            items={items}
            onClaim={handleClaim}
            onViewMatches={handleViewMatches}
            currentUserId={currentUserId}
          />
        )}

        {/* Chat Window */}
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
