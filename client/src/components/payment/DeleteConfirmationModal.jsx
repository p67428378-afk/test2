import React from "react";
import Modal from "react-modal";
import { AlertTriangle, X } from "lucide-react";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1E293B",
    border: "1px solid #334155",
    borderRadius: "0.75rem",
    padding: "24px",
    maxWidth: "450px",
    width: "90%",
    color: "#F8FAFC",
  },
  overlay: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    zIndex: 1000,
  },
};

export default function DeleteConfirmationModal({
  isOpen,
  onRequestClose,
  onConfirm,
  card,
}) {
  if (!card) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Delete Saved Card"
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 text-amber-500">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-semibold">Delete Saved Card</h3>
          </div>
          <button
            onClick={onRequestClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          Are you sure you want to delete your saved{" "}
          <span className="font-semibold uppercase text-indigo-300">
            {card.card_brand}
          </span>{" "}
          card ending in{" "}
          <span className="font-semibold text-indigo-300">
            {card.card_last_four}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(card.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Delete Card
          </button>
        </div>
      </div>
    </Modal>
  );
}
