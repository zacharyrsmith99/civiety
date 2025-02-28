"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  LandTile,
  GridPosition,
  HousingBuildingType,
} from "@/store/slices/types/land";
import { positionKey } from "@/store/slices/util/initialLandState";
import { addBuildingToQueue } from "@/store/slices/landSlice";

interface BuildingPanelProps {
  selectedTile: LandTile | null;
  position: GridPosition | null;
}

export const BuildingPanel: React.FC<BuildingPanelProps> = ({
  selectedTile,
  position,
}) => {
  const dispatch = useAppDispatch();
  const buildingInitialCosts = useAppSelector(
    (state) => state.land.buildingInitialCosts,
  );
  const buildingQueue = useAppSelector((state) => state.land.buildingQueue);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  if (!selectedTile || !position) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-slate-800/80 border border-amber-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🗺️</div>
          <h3 className="text-lg font-medieval text-amber-200 mb-2">
            Select a Tile
          </h3>
          <p className="text-amber-100/80 text-sm">Click on a tile to build.</p>
        </div>
      </div>
    );
  }

  const tileKey = positionKey(position);
  const hasBuildingInQueue = buildingQueue.some(
    (building) => positionKey(building.position) === tileKey,
  );

  if (!selectedTile.controlled) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-slate-800/80 border border-amber-700/30 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🚫</div>
          <h3 className="text-lg font-medieval text-amber-200 mb-2">
            Uncontrolled Tile
          </h3>
          <p className="text-amber-100/80 text-sm">
            You need to control this tile first.
          </p>
        </div>
      </div>
    );
  }

  const handleAddBuilding = () => {
    const buildingName = "makeshiftHousing" as HousingBuildingType;
    const initialCost = buildingInitialCosts.housing[buildingName];

    dispatch(
      addBuildingToQueue({
        name: buildingName,
        type: "housing",
        position,
        level: selectedQuantity,
        initialCost: {
          labor: initialCost.labor * selectedQuantity,
          hide: initialCost.hide * selectedQuantity,
          food: initialCost.food * selectedQuantity,
          wood: initialCost.wood * selectedQuantity,
          stone: initialCost.stone * selectedQuantity,
        },
        remainingCost: {
          labor: initialCost.labor * selectedQuantity,
          hide: initialCost.hide * selectedQuantity,
          food: initialCost.food * selectedQuantity,
          wood: initialCost.wood * selectedQuantity,
          stone: initialCost.stone * selectedQuantity,
        },
        accumulatedLabor: 0,
      }),
    );
  };

  // For now, we only have makeshift housing as buildable
  const canBuildHousing = selectedTile.allowHousing;

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-amber-700/30">
        <h2 className="text-lg font-medieval text-amber-200">
          Building Construction
        </h2>
        <div className="text-xs text-amber-100/70">
          Position: ({position.x}, {position.y}) • {selectedTile.biome}
        </div>
      </div>

      <div className="p-3 flex-1">
        {hasBuildingInQueue ? (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 text-center text-sm">
            <p className="text-amber-100">Construction in progress...</p>
          </div>
        ) : (
          <>
            {canBuildHousing ? (
              <div>
                <div className="mb-3 flex justify-between items-center">
                  <span className="font-medieval text-amber-200 text-sm">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      className="w-6 h-6 flex items-center justify-center bg-amber-800/70 text-white rounded text-xs hover:bg-amber-700/70"
                      onClick={() => setSelectedQuantity(1)}
                    >
                      1
                    </button>
                    <button
                      className="w-6 h-6 flex items-center justify-center bg-amber-800/70 text-white rounded text-xs hover:bg-amber-700/70"
                      onClick={() => setSelectedQuantity(5)}
                    >
                      5
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={selectedQuantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1) {
                          setSelectedQuantity(value);
                        }
                      }}
                      className="w-12 bg-slate-800 border border-amber-700/50 rounded px-1 py-0.5 text-amber-100 text-center text-xs"
                    />
                  </div>
                </div>

                <div
                  className="bg-slate-800/70 hover:bg-slate-700/70 text-amber-100 rounded-lg border border-amber-700/30 p-3 transition-all duration-200 shadow-lg flex items-center cursor-pointer"
                  onClick={handleAddBuilding}
                >
                  <div className="text-xl mr-3">
                    <div className="flex items-center">
                      <img
                        src="/icons/makeshift-housing-icon.png"
                        alt="Makeshift Housing"
                        className="w-24 h-24"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medieval text-sm">
                      Makeshift Housing
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-amber-300">
                        Cost:{" "}
                        {buildingInitialCosts.housing.makeshiftHousing.labor *
                          selectedQuantity}{" "}
                        labor
                      </div>
                      {selectedQuantity > 1 && (
                        <div className="text-xs text-amber-100/60">
                          x{selectedQuantity}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/80 border border-amber-700/30 rounded-lg p-3 text-center">
                <p className="text-amber-100/80 text-sm">
                  No buildings available for this tile type.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
