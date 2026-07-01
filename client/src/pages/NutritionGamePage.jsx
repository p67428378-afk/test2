import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Basket from "../components/nutrition/Basket";
import DraggableFood from "../components/nutrition/DraggableFood";
import { ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { getActivities, saveProgress } from "../services/api";

const INITIAL_FOODS = [
  { id: "f1", name: "Apple", icon: "🍎", type: "healthy" },
  { id: "f2", name: "Broccoli", icon: "🥦", type: "healthy" },
  { id: "f3", name: "Carrot", icon: "🥕", type: "healthy" },
  { id: "f4", name: "Donut", icon: "🍩", type: "sometimes" },
  { id: "f5", name: "Pizza", icon: "🍕", type: "sometimes" },
  { id: "f6", name: "Soda", icon: "🥤", type: "sometimes" },
];

export default function NutritionGamePage({
  user,
  progress,
  onBack,
  onRefreshProgress,
}) {
  const [foods, setFoods] = useState(INITIAL_FOODS);
  const [healthyBasket, setHealthyBasket] = useState([]);
  const [sometimesBasket, setSometimesBasket] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [activity, setActivity] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState(
    "Drag the foods to the correct baskets!",
  );

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getActivities("nutrition");
        if (data && data.length > 0) {
          setActivity(data[0]);
        }
      } catch (error) {
        console.error("Error fetching nutrition activity:", error);
      }
    };
    fetchActivity();
  }, []);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, basketType) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.type === basketType) {
      // Correct placement
      if (basketType === "healthy") {
        setHealthyBasket([...healthyBasket, draggedItem]);
      } else {
        setSometimesBasket([...sometimesBasket, draggedItem]);
      }
      setFoods(foods.filter((f) => f.id !== draggedItem.id));
      setMessage(`Great job! ${draggedItem.name} is in the right place! 🎉`);
    } else {
      // Incorrect placement
      setMessage(
        `Oops! Try putting ${draggedItem.name} in the other basket! 🤔`,
      );
    }
    setDraggedItem(null);
  };

  useEffect(() => {
    if (foods.length === 0 && INITIAL_FOODS.length > 0) {
      setIsCompleted(true);
      handleGameComplete();
    }
  }, [foods]);

  const handleGameComplete = async () => {
    if (!user || !activity) return;
    try {
      await saveProgress(user.id, activity.id, true, 100);
      onRefreshProgress();
      setMessage("Awesome! You sorted all the foods correctly! 🌟");
    } catch (error) {
      console.error("Error saving game progress:", error);
    }
  };

  const handleReset = () => {
    setFoods(INITIAL_FOODS);
    setHealthyBasket([]);
    setSometimesBasket([]);
    setIsCompleted(false);
    setMessage("Drag the foods to the correct baskets!");
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] pb-12">
      <Header user={user} points={progress?.total_points || 0} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-slate-600 font-bold hover:underline"
          >
            <RefreshCw size={16} />
            Reset Game
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-4 border-sky-100 text-center space-y-6">
          <h2 className="text-3xl font-black text-primary">
            🍎 Sort the Foods! 🥦
          </h2>
          <p className="text-lg font-bold text-slate-700 bg-sky-50 py-3 px-6 rounded-xl inline-block">
            {message}
          </p>

          {/* Draggable Items */}
          {foods.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center py-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 min-h-[120px] items-center">
              {foods.map((food) => (
                <DraggableFood
                  key={food.id}
                  item={food}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          ) : (
            <div className="py-6 bg-emerald-50 rounded-xl border-2 border-emerald-200 text-emerald-800 font-bold flex flex-col items-center gap-2">
              <CheckCircle className="text-emerald-500" size={48} />
              <span>All sorted! You are a Nutrition Champion!</span>
            </div>
          )}

          {/* Baskets */}
          <div className="flex flex-col md:flex-row gap-6 pt-6">
            <Basket
              type="healthy"
              title="Healthy Foods"
              icon="🥗"
              color="border-emerald-300 bg-emerald-50/50 text-emerald-800"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              items={healthyBasket}
            />
            <Basket
              type="sometimes"
              title="Sometimes Foods"
              icon="🍩"
              color="border-amber-300 bg-amber-50/50 text-amber-800"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              items={sometimesBasket}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
