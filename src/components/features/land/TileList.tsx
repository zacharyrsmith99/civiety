import React, { useState, useMemo } from "react";
import { LandTile, GridPosition } from "@/store/slices/types/land";
import { positionKey } from "@/store/slices/util/initialLandState";
import { useAppSelector } from "@/store/hooks";
import { selectControlledTiles } from "@/store/slices/landSlice";
import { scrollbarStyles } from "@/config/scrollbarStyles";

interface TileListProps {
  selectedPosition: GridPosition | null;
  onTileSelect: (position: GridPosition | null) => void;
}

export const TileList: React.FC<TileListProps> = ({
  selectedPosition,
  onTileSelect,
}) => {
  const controlledTiles = useAppSelector(selectControlledTiles);

  const biomeGroups = useMemo(() => {
    const groups: Record<string, LandTile[]> = {};

    controlledTiles.forEach((tile) => {
      const biome = tile.biome;
      if (!groups[biome]) {
        groups[biome] = [];
      }
      groups[biome].push(tile);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [controlledTiles]);

  const [expandedBiomes, setExpandedBiomes] = useState<Record<string, boolean>>(
    {},
  );

  const toggleBiome = (biome: string) => {
    setExpandedBiomes((prev) => ({
      ...prev,
      [biome]: !prev[biome],
    }));
  };

  if (controlledTiles.length === 0) {
    return (
      <div className="text-center py-3">
        <div className="text-2xl mb-1">🏞️</div>
        <p className="text-amber-100/80">You don't control any land yet.</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
        {biomeGroups.map(([biome, tiles]) => (
          <div key={biome} className="mb-1">
            <div
              className="flex justify-between items-center bg-amber-900/30 p-1.5 rounded-lg border border-amber-700/50 cursor-pointer hover:bg-amber-900/40 transition-colors"
              onClick={() => toggleBiome(biome)}
            >
              <span className="text-amber-200 font-medieval">
                {biome.charAt(0).toUpperCase() + biome.slice(1)} ({tiles.length}
                )
              </span>
              <span className="text-amber-200">
                {expandedBiomes[biome] ? "▾" : "▸"}
              </span>
            </div>

            {expandedBiomes[biome] && (
              <div className="pl-2 mt-1 space-y-1">
                {tiles.map((tile) => {
                  const isSelected =
                    selectedPosition &&
                    selectedPosition.x === tile.position.x &&
                    selectedPosition.y === tile.position.y;

                  return (
                    <div
                      key={positionKey(tile.position)}
                      className={`
                        p-1.5 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "bg-amber-900/40 border-2 border-amber-500/50"
                            : "bg-slate-800/70 border border-amber-700/30 hover:bg-slate-700/50"
                        }
                      `}
                      onClick={() => onTileSelect(tile.position)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-xs px-1 py-0.5 rounded bg-slate-700/50 text-amber-100/90">
                          {tile.terrain}
                        </div>
                        <div className="text-xs px-1 rounded bg-amber-800/50 text-amber-100">
                          {tile.position.x}, {tile.position.y}
                        </div>
                      </div>

                      <div className="flex justify-between mt-1 items-center">
                        <div className="flex flex-wrap gap-1 mt-1 text-xs">
                          {Object.keys(tile.buildings.housing).length > 0 && (
                            <span className="bg-slate-700/30 px-1 py-0.5 rounded">
                              🏠 {Object.keys(tile.buildings.housing).length}
                            </span>
                          )}
                          {Object.keys(tile.buildings.agriculture).length >
                            0 && (
                            <span className="bg-slate-700/30 px-1 py-0.5 rounded">
                              🌾{" "}
                              {Object.keys(tile.buildings.agriculture).length}
                            </span>
                          )}
                          {Object.keys(tile.buildings.industry).length > 0 && (
                            <span className="bg-slate-700/30 px-1 py-0.5 rounded">
                              ⚒️ {Object.keys(tile.buildings.industry).length}
                            </span>
                          )}
                        </div>

                        <div className="flex space-x-1">
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full ${
                              tile.allowHousing
                                ? "bg-green-900/40 border border-green-500/50"
                                : "bg-red-900/40 border border-red-500/50"
                            }`}
                            title={
                              tile.allowHousing
                                ? "Housing allowed"
                                : "Housing not allowed"
                            }
                          >
                            🏠
                          </div>
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full ${
                              tile.allowAgriculture
                                ? "bg-green-900/40 border border-green-500/50"
                                : "bg-red-900/40 border border-red-500/50"
                            }`}
                            title={
                              tile.allowAgriculture
                                ? "Agriculture allowed"
                                : "Agriculture not allowed"
                            }
                          >
                            🌾
                          </div>
                          <div
                            className={`flex items-center justify-center w-6 h-6 rounded-full ${
                              tile.allowIndustry
                                ? "bg-green-900/40 border border-green-500/50"
                                : "bg-red-900/40 border border-red-500/50"
                            }`}
                            title={
                              tile.allowIndustry
                                ? "Industry allowed"
                                : "Industry not allowed"
                            }
                          >
                            ⚒️
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
