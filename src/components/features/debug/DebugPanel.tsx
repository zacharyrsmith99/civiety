"use client";

import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { resetGame } from "@/store/slices/gameSlice";

const DebugPanel = () => {
  const dispatch = useAppDispatch();

  const handleReset = () => {
    dispatch(resetGame());
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleReset}
        className="px-3 py-1.5 text-xs rounded-lg bg-amber-800/40 text-amber-100 hover:bg-amber-700/60 transition-colors border-2 border-amber-800/30"
      >
        Debug Reset
      </button>
    </div>
  );
};

export default DebugPanel;
