import React, { useEffect, useState } from "react";
import KidHeader from "../components/KidHeader";
import AlphabetCard from "../components/AlphabetCard";
import InteractivePlayArea from "../components/InteractivePlayArea";
import { learningService, progressService } from "../services/api";

export default function AlphabetPage() {
  const [items, setItems] = useState([]);
  const [exploredIds, setExploredIds] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [allItems, progress] = await Promise.all([
          learningService.getItems(),
          progressService.getProgress(),
        ]);

        const alphabetItems = allItems.filter(
          (item) => item.type === "alphabet",
        );
        // Sort alphabetically just in case
        alphabetItems.sort((a, b) => a.value.localeCompare(b.value));

        setItems(alphabetItems);
        setExploredIds(progress.explored_item_ids || []);
      } catch (err) {
        console.error("Error fetching alphabet data:", err);
        setError("Failed to load learning items. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelect = async (item) => {
    setSelectedItem(item);
    try {
      const response = await progressService.logProgress(item.id);
      // Update explored list
      if (!exploredIds.includes(item.id)) {
        setExploredIds((prev) => [...prev, item.id]);
      }
    } catch (err) {
      console.error("Error logging progress:", err);
    }
  };

  return (
    <div className="bg-[#f2faff] flex flex-col gap-[24px] items-start p-[32px] relative min-h-screen w-full">
      <KidHeader activeTab="letters" />

      <div className="flex flex-col lg:flex-row gap-[24px] items-start overflow-clip relative shrink-0 w-full">
        <div className="flex flex-col flex-[6_0_0] items-start min-w-px overflow-clip relative self-stretch">
          <div className="bg-white border border-[#cce0f2] border-solid flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[14px] w-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)]">
            <h2 className="text-[20px] font-bold text-[#1a2640] px-2">
              Tap a letter to explore! 🔤
            </h2>

            {loading ? (
              <div className="flex justify-center items-center w-full min-h-[200px]">
                <p className="text-[#ff6e00] text-[20px] font-bold animate-pulse">
                  Loading letters...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg w-full">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-[12px] w-full justify-items-center">
                {items.map((item, index) => (
                  <AlphabetCard
                    key={item.id}
                    item={item}
                    index={index}
                    isExplored={exploredIds.includes(item.id)}
                    onSelect={handleSelect}
                    isSelected={selectedItem?.id === item.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-[5_0_0] items-start min-w-px overflow-clip relative self-stretch w-full lg:w-auto">
          <InteractivePlayArea
            item={selectedItem}
            type="alphabet"
            onExplored={null} // Already logged on select
          />
        </div>
      </div>
    </div>
  );
}
