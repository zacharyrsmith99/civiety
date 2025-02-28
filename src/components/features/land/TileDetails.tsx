import React, { useState, useEffect } from "react";
import {
  LandTile,
  GridPosition,
  HousingBuildingType,
} from "@/store/slices/types/land";
import { BuildingPanel } from "../buildings/BuildingPanel";
import { scrollbarStyles } from "@/config/scrollbarStyles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTilePermissions } from "@/store/slices/landSlice";

type TileSubTab = "overview" | "build" | "improve";

interface TileDetailsProps {
  selectedTile: LandTile | null;
  selectedPosition: GridPosition | null;
}

const toTitleCase = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export const TileDetails: React.FC<TileDetailsProps> = ({
  selectedTile,
  selectedPosition,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<TileSubTab>("overview");
  const [pendingChanges, setPendingChanges] = useState<{
    allowHousing: boolean;
    allowAgriculture: boolean;
    allowIndustry: boolean;
  } | null>(null);

  const dispatch = useAppDispatch();

  const { buildingInfo } = useAppSelector((state) => state.land);

  useEffect(() => {
    setActiveSubTab("overview");
    setPendingChanges(null);
  }, [selectedPosition]);

  useEffect(() => {
    if (selectedTile) {
      setPendingChanges({
        allowHousing: selectedTile.allowHousing,
        allowAgriculture: selectedTile.allowAgriculture,
        allowIndustry: selectedTile.allowIndustry,
      });
    }
  }, [selectedTile]);

  const handleTogglePermission = (
    permission: "allowHousing" | "allowAgriculture" | "allowIndustry",
  ) => {
    if (pendingChanges) {
      setPendingChanges({
        ...pendingChanges,
        [permission]: !pendingChanges[permission],
      });
    }
  };

  const handleSaveChanges = () => {
    if (selectedPosition && pendingChanges) {
      dispatch(
        updateTilePermissions({
          position: selectedPosition,
          permissions: pendingChanges,
        }),
      );
    }
  };

  const hasChanges = () => {
    if (!selectedTile || !pendingChanges) return false;

    return (
      pendingChanges.allowHousing !== selectedTile.allowHousing ||
      pendingChanges.allowAgriculture !== selectedTile.allowAgriculture ||
      pendingChanges.allowIndustry !== selectedTile.allowIndustry
    );
  };

  if (!selectedTile || !selectedPosition || !pendingChanges) {
    return (
      <div className="text-center py-4">
        <div className="text-2xl mb-1">🗺️</div>
        <h3 className="text-lg font-medieval text-amber-200 mb-1">
          Select a Tile
        </h3>
        <p className="text-amber-100/80 text-sm">
          Select a tile to view details.
        </p>
      </div>
    );
  }

  let totalHousingCapacity = 0;
  Object.entries(selectedTile.buildings.housing).forEach(([key, value]) => {
    totalHousingCapacity +=
      value.level * buildingInfo.housing[key as HousingBuildingType].capacity;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="flex flex-col h-full">
        <div className="flex border-b border-amber-700/30 mb-2">
          <button
            onClick={() => setActiveSubTab("overview")}
            className={`px-3 py-1 border-b-2 transition-colors ${
              activeSubTab === "overview"
                ? "border-amber-500 text-amber-200"
                : "border-transparent text-amber-100/60 hover:text-amber-100/80"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab("build")}
            className={`px-3 py-1 border-b-2 transition-colors ${
              activeSubTab === "build"
                ? "border-amber-500 text-amber-200"
                : "border-transparent text-amber-100/60 hover:text-amber-100/80"
            }`}
          >
            Build
          </button>
          <button
            onClick={() => setActiveSubTab("improve")}
            className={`px-3 py-1 border-b-2 transition-colors ${
              activeSubTab === "improve"
                ? "border-amber-500 text-amber-200"
                : "border-transparent text-amber-100/60 hover:text-amber-100/80"
            }`}
          >
            Improve
          </button>
        </div>

        {activeSubTab === "overview" && (
          <div className="custom-scrollbar overflow-y-auto pr-1">
            <div className="flex justify-between items-center mb-3 bg-amber-900/10 p-3 rounded-lg border border-amber-700/30 shadow-inner">
              <div>
                <h3 className="text-lg font-medieval text-amber-200 drop-shadow-sm">
                  {selectedTile.biome.charAt(0).toUpperCase() +
                    selectedTile.biome.slice(1)}
                </h3>
                <p className="text-sm text-amber-100/80">
                  {selectedTile.position.x}, {selectedTile.position.y}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shadow-md ${
                      pendingChanges.allowHousing
                        ? "bg-green-900/50 border border-green-500/70 hover:bg-green-900/70"
                        : "bg-red-900/50 border border-red-500/70 hover:bg-red-900/70"
                    } transition-colors`}
                    onClick={() => handleTogglePermission("allowHousing")}
                    title={
                      pendingChanges.allowHousing
                        ? "Housing allowed (click to disable)"
                        : "Housing not allowed (click to enable)"
                    }
                  >
                    🏠
                  </div>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shadow-md ${
                      pendingChanges.allowAgriculture
                        ? "bg-green-900/50 border border-green-500/70 hover:bg-green-900/70"
                        : "bg-red-900/50 border border-red-500/70 hover:bg-red-900/70"
                    } transition-colors`}
                    onClick={() => handleTogglePermission("allowAgriculture")}
                    title={
                      pendingChanges.allowAgriculture
                        ? "Agriculture allowed (click to disable)"
                        : "Agriculture not allowed (click to enable)"
                    }
                  >
                    🌾
                  </div>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer shadow-md ${
                      pendingChanges.allowIndustry
                        ? "bg-green-900/50 border border-green-500/70 hover:bg-green-900/70"
                        : "bg-red-900/50 border border-red-500/70 hover:bg-red-900/70"
                    } transition-colors`}
                    onClick={() => handleTogglePermission("allowIndustry")}
                    title={
                      pendingChanges.allowIndustry
                        ? "Industry allowed (click to disable)"
                        : "Industry not allowed (click to enable)"
                    }
                  >
                    ⚒️
                  </div>
                </div>

                {hasChanges() && (
                  <button
                    onClick={handleSaveChanges}
                    className="bg-amber-700 hover:bg-amber-600 text-amber-100 text-sm px-3 py-1 rounded shadow-md transition-colors font-medium"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-800/30 p-3 rounded-lg border border-amber-700/30 shadow-md">
                <h4 className="text-amber-400 text-sm font-medieval mb-1">
                  Terrain
                </h4>
                <p className="text-amber-100">{selectedTile.terrain}</p>
              </div>
            </div>

            {/* Housing Section */}
            {Object.keys(selectedTile.buildings.housing).length > 0 && (
              <div className="mb-4 bg-slate-800/20 rounded-lg p-3 border border-amber-700/30 shadow-md">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-900/30">
                  <h4 className="text-amber-300 font-medieval text-lg">
                    Housing
                  </h4>
                  <span className="text-sm bg-amber-900/60 px-3 py-1 rounded-lg border border-amber-500/30 text-amber-100 font-medium shadow-sm">
                    Total Capacity: {totalHousingCapacity}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedTile.buildings.housing).map(
                    ([building, data]) => (
                      <div
                        key={building}
                        className="bg-slate-700/40 p-3 rounded-lg border border-amber-700/30 flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          {building === "makeshiftHousing" ? (
                            <img
                              src="/icons/makeshift-housing-icon.png"
                              alt="Makeshift Housing"
                              className="w-10 h-10 mr-3"
                            />
                          ) : (
                            <span className="w-10 h-10 flex items-center justify-center mr-3">
                              🏠
                            </span>
                          )}
                          <span className="text-amber-100 font-medium">
                            {toTitleCase(building)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm bg-amber-800 px-3 py-1 rounded-lg border border-amber-500/30 mr-2 text-amber-100 font-medium shadow-sm">
                            Level {data.level}
                          </span>
                          <span className="text-amber-300 text-sm font-medium">
                            Capacity:{" "}
                            {data.level *
                              buildingInfo.housing[
                                building as HousingBuildingType
                              ].capacity}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Agriculture Section */}
            {Object.keys(selectedTile.buildings.agriculture).length > 0 && (
              <div className="mb-4 bg-slate-800/20 rounded-lg p-3 border border-amber-700/30 shadow-md">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-900/30">
                  <h4 className="text-amber-300 font-medieval text-lg">
                    Agriculture
                  </h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedTile.buildings.agriculture).map(
                    ([building, data]) => (
                      <div
                        key={building}
                        className="bg-slate-700/40 p-3 rounded-lg border border-amber-700/30 flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="w-10 h-10 flex items-center justify-center mr-3">
                            🌾
                          </span>
                          <span className="text-amber-100 font-medium">
                            {toTitleCase(building)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm bg-amber-800 px-3 py-1 rounded-lg border border-amber-500/30 text-amber-100 font-medium shadow-sm">
                            Level {data.level}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Industry Section */}
            {Object.keys(selectedTile.buildings.industry).length > 0 && (
              <div className="mb-4 bg-slate-800/20 rounded-lg p-3 border border-amber-700/30 shadow-md">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-900/30">
                  <h4 className="text-amber-300 font-medieval text-lg">
                    Industry
                  </h4>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedTile.buildings.industry).map(
                    ([building, data]) => (
                      <div
                        key={building}
                        className="bg-slate-700/40 p-3 rounded-lg border border-amber-700/30 flex justify-between items-center hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="w-10 h-10 flex items-center justify-center mr-3">
                            ⚒️
                          </span>
                          <span className="text-amber-100 font-medium">
                            {toTitleCase(building)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm bg-amber-800 px-3 py-1 rounded-lg border border-amber-500/30 text-amber-100 font-medium shadow-sm">
                            Level {data.level}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "build" && (
          <BuildingPanel
            selectedTile={selectedTile}
            position={selectedPosition}
          />
        )}

        {activeSubTab === "improve" && (
          <div className="bg-slate-800/30 rounded-lg p-4 border border-amber-700/30 text-center shadow-md">
            <div className="text-2xl mb-2">🛠️</div>
            <h3 className="text-lg font-medieval text-amber-200 mb-2">
              Improvements
            </h3>
            <p className="text-amber-100/80">
              Tile improvements will be available in a future update.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
