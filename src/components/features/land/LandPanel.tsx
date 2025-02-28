"use client";
import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { LandTile, GridPosition } from "@/store/slices/types/land";
import { TileList } from "./TileList";
import { TileDetails } from "./TileDetails";
import { BuildingQueue } from "./BuildingQueue";

interface LandPanelProps {
  selectedTile: LandTile | null;
  selectedPosition: GridPosition | null;
  onTileSelect: (position: GridPosition | null) => void;
}

type LandSubTab = "tiles" | "queue";

export const LandPanel: React.FC<LandPanelProps> = ({
  selectedTile,
  selectedPosition,
  onTileSelect,
}) => {
  const [activeLandTab, setActiveLandTab] = useState<LandSubTab>("tiles");
  const buildingQueue = useAppSelector((state) => state.land.buildingQueue);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-amber-700/30">
        <h2 className="text-lg font-medieval text-amber-200 flex items-center">
          <span className="text-amber-400 mr-1">🏞️</span>
          Land
        </h2>
        <div className="mb-2 mt-1">
          <div className="flex border-b border-amber-700/30">
            <button
              onClick={() => setActiveLandTab("tiles")}
              className={`px-3 py-1 text-sm ${
                activeLandTab === "tiles"
                  ? "text-amber-300 border-b-2 border-amber-500"
                  : "text-amber-100/70 hover:text-amber-100"
              }`}
            >
              Tile Overview
            </button>
            <button
              onClick={() => setActiveLandTab("queue")}
              className={`px-3 py-1 text-sm ${
                activeLandTab === "queue"
                  ? "text-amber-300 border-b-2 border-amber-500"
                  : "text-amber-100/70 hover:text-amber-100"
              }`}
            >
              Building Queue{" "}
              {buildingQueue.length > 0 && `(${buildingQueue.length})`}
            </button>
          </div>
        </div>
      </div>

      <div className="p-2 flex-1">
        {activeLandTab === "tiles" ? (
          <div className="flex flex-col lg:flex-row gap-2 h-full">
            <div className="lg:w-1/3">
              <h3 className="text-amber-200 font-medieval mb-1">
                Controlled Tiles
              </h3>
              <TileList
                selectedPosition={selectedPosition}
                onTileSelect={onTileSelect}
              />
            </div>

            <div className="lg:w-2/3 flex-1">
              <h3 className="text-amber-200 font-medieval mb-1">
                Tile Details
              </h3>
              <TileDetails
                selectedTile={selectedTile}
                selectedPosition={selectedPosition}
              />
            </div>
          </div>
        ) : (
          <div className="h-full">
            <BuildingQueue />
          </div>
        )}
      </div>
    </div>
  );
};
