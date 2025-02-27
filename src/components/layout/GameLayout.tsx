"use client";
import React, { useState } from "react";
import ResourcePanel from "../features/game-controls/LedgerPanel";
import { SettlementOverview } from "../features/settlement-overview";
import MapPanel from "../features/map/MapPanel";
import { GridPosition } from "@/store/slices/types/land";

const LogoPlaceholder = () => (
  <div className="flex items-center justify-center p-4 bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-700/30 rounded-xl shadow-lg relative">
    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-500/20 rounded-tl-xl" />
    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-500/20 rounded-tr-xl" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-500/20 rounded-bl-xl" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-500/20 rounded-br-xl" />

    <div className="absolute inset-0 bg-amber-900/10 blur-xl rounded-xl" />

    <h1 className="text-3xl font-bold font-medieval tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 relative z-10 uppercase">
      Civiety
    </h1>

    <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/30 to-transparent" />
    </div>
  </div>
);

export const GameLayout = () => {
  const [selectedPosition, setSelectedPosition] = useState<GridPosition | null>(
    null,
  );
  const handleTileSelect = (position: GridPosition | null) => {
    setSelectedPosition(position);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 bg-gradient-to-br from-amber-950/10 to-slate-950 flex">
      {/* Left sidebar */}
      <ResourcePanel />

      {/* Main game area container */}
      <div className="flex-1 flex flex-col">
        {/* Main content area with overview and map */}
        <div className="flex-1 flex min-h-0">
          {/* Settlement overview container */}
          <div className="w-[60%] min-h-0 relative">
            <div className="absolute -top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />
            <SettlementOverview selectedPosition={selectedPosition} />
          </div>

          {/* Map section with logo */}
          <div className="flex-1 flex flex-col">
            <div className="h-14">
              <LogoPlaceholder />
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              <div className="absolute -top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />
              <MapPanel
                onTileSelect={handleTileSelect}
                selectedPosition={selectedPosition}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
