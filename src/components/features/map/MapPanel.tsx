import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { GameMap } from "./GridMap";
import {
  selectControlledTiles,
  selectTileAt,
  addImprovement,
} from "@/store/slices/landSlice";
import { GridPosition } from "@/store/slices/types/land";

interface MapPanelProps {
  className?: string;
  onTileSelect: (position: GridPosition | null) => void;
  selectedPosition: GridPosition | null;
}

const MapPanel: React.FC<MapPanelProps> = ({
  className = "",
  onTileSelect,
  selectedPosition,
}) => {
  const dispatch = useAppDispatch();

  const selectedTileFromState = useAppSelector((state) =>
    selectedPosition ? selectTileAt(state, selectedPosition) : null,
  );

  const selectedTile = selectedPosition ? selectedTileFromState : null;

  const handleTileSelect = (position: GridPosition) => {
    if (
      selectedPosition &&
      position.x === selectedPosition.x &&
      position.y === selectedPosition.y
    ) {
      onTileSelect(null);
    } else {
      onTileSelect(position);
    }
  };

  const handleMapBackgroundClick = () => {
    onTileSelect(null);
  };

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border-2 border-amber-700/30 ${className}`}
    >
      <div className="flex flex-1 min-h-0">
        {/* Main map view */}
        <div className="flex-1 p-4">
          <div className="h-full relative rounded-lg overflow-hidden border-2 border-amber-700/30">
            <GameMap
              onTileSelect={handleTileSelect}
              selectedPosition={selectedPosition}
              onBackgroundClick={handleMapBackgroundClick}
            />

            {selectedTile && (
              <div className="absolute bottom-4 left-4 bg-slate-900/90 p-3 rounded-lg border-2 border-amber-700/30 text-white shadow-lg max-w-xs">
                <div className="flex justify-between items-start">
                  <h3 className="text-amber-500 font-semibold mb-1">
                    Tile Information
                  </h3>
                  <button
                    onClick={() => onTileSelect(null)}
                    className="text-amber-400 hover:text-amber-200 ml-2"
                  >
                    ✕
                  </button>
                </div>
                <p>
                  <span className="text-amber-400">Biome:</span>{" "}
                  {selectedTile.biome}
                </p>
                <p>
                  <span className="text-amber-400">Buildings:</span>{" "}
                  {Object.keys(selectedTile.buildings).join(", ")}
                </p>
                <p>
                  <span className="text-amber-400">Position:</span> (
                  {selectedPosition?.x}, {selectedPosition?.y})
                </p>
                <p>
                  <span className="text-amber-400">Terrain:</span>{" "}
                  {selectedTile.terrain}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;
