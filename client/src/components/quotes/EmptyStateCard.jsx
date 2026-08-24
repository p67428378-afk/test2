import React from "react";
import Button from "../common/Button";

export default function EmptyStateCard({ onActionClick }) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-2xl p-6 shadow-sm w-full">
      <div className="flex flex-col gap-4 items-center justify-center p-8 text-center">
        <p className="text-5xl">🤍</p>
        <p className="font-bold text-[#171c29] text-xl">
          No Favorites Saved Yet
        </p>
        <p className="text-[#707a8c] text-sm max-w-md">
          You haven't saved any favorites yet! Start discovering quotes to add
          some.
        </p>
        {onActionClick && (
          <Button variant="primary" onClick={onActionClick} className="mt-2">
            <span>✨</span>
            <span>Discover Quotes</span>
          </Button>
        )}
      </div>
    </div>
  );
}
