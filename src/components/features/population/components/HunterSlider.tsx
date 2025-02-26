import React from "react";
import { useAppSelector } from "@/store/hooks";
import { OccupationsState } from "@/store/slices/occupationsSlice";
import { getWorkingAgePopulation } from "@/store/middleware/util/stateInformationHelper";
import { getBaseProductionResourcesWorkerCapacity } from "@/store/middleware/util/occupationActions";
import { Tooltip } from "@/components/ui/Tooltip";

interface HunterSliderProps {
  sliderData: {
    percentage: number;
    canAssign: boolean;
    isAvailable: boolean;
    errorMessage?: string;
  };
  onSliderChange: (
    id: keyof OccupationsState["size"],
    newPercentage: number,
  ) => void;
}

export const HunterSlider: React.FC<HunterSliderProps> = ({
  sliderData,
  onSliderChange,
}) => {
  const workingPopulation = useAppSelector(getWorkingAgePopulation);
  const baseProductionResourcesWorkerCapacity = useAppSelector(
    getBaseProductionResourcesWorkerCapacity,
  );

  const { percentage, canAssign, isAvailable, errorMessage } = sliderData;

  return (
    <Tooltip
      content="Hunters provide meat and hides by hunting wild animals and are limited by the amount of open land."
      position="bottom"
      width="200px"
    >
      <div
        className={`
          bg-slate-900/50 rounded-lg p-4 border border-amber-700/30
          ${!isAvailable ? "opacity-50" : ""}
          relative overflow-hidden
          hover:bg-slate-900/70 transition-colors duration-200
        `}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medieval text-amber-200">Hunters</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-300">
              {Math.round(percentage)}%
            </span>
            <span className="text-xs text-slate-400">
              ({Math.floor((percentage / 100) * workingPopulation)}/
              {baseProductionResourcesWorkerCapacity} workers)
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) =>
            onSliderChange("hunters", parseFloat(e.target.value))
          }
          disabled={!isAvailable || !canAssign}
          className="
            w-full h-2 rounded-lg appearance-none cursor-pointer
            bg-slate-700 
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-amber-500
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-amber-700
            [&::-webkit-slider-thumb]:shadow-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        />

        {errorMessage && (
          <p className="text-rose-400 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
    </Tooltip>
  );
};
