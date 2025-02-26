import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getWorkingAgePopulation } from "@/store/middleware/util/stateInformationHelper";
import {
  OccupationsState,
  setOccupationAllocation,
} from "@/store/slices/occupationsSlice";
import { HunterSlider } from "./components/HunterSlider";
import { GathererSlider } from "./components/GathererSlider";

interface OccupationSlider {
  id: keyof OccupationsState["size"];
  label: string;
  percentage: number;
  canAssign: boolean;
  isAvailable: boolean;
  errorMessage?: string;
}

export const LaborManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const workingPopulation = useAppSelector(getWorkingAgePopulation);
  const { size: occupationSize, occupationAllocation } = useAppSelector(
    (state) => state.occupations,
  );

  const totalEmployed = Object.values(occupationSize).reduce(
    (sum, count) => sum + count,
    0,
  );
  const unemployed = workingPopulation - totalEmployed;

  const [sliders, setSliders] = useState<OccupationSlider[]>([
    {
      id: "gatherers",
      label: "Gatherers",
      percentage: 0,
      canAssign: true,
      isAvailable: true,
    },
    {
      id: "farmers",
      label: "Farmers",
      percentage: 0,
      canAssign: true,
      isAvailable: true,
    },
    {
      id: "hunters",
      label: "Hunters",
      percentage: 0,
      canAssign: true,
      isAvailable: true,
    },
    {
      id: "soldiers",
      label: "Soldiers",
      percentage: 0,
      canAssign: false,
      isAvailable: false,
      errorMessage: "Not yet available",
    },
    {
      id: "coalMiners",
      label: "Coal Miners",
      percentage: 0,
      canAssign: false,
      isAvailable: false,
      errorMessage: "Not yet available",
    },
    {
      id: "woodcutters",
      label: "Woodcutters",
      percentage: 0,
      canAssign: false,
      isAvailable: false,
      errorMessage: "Not yet available",
    },
  ]);

  useEffect(() => {
    if (workingPopulation === 0) return;

    const newSliders = sliders.map((slider) => {
      const workerCount = occupationSize[slider.id] || 0;
      const percentage = (workerCount / workingPopulation) * 100;

      return {
        ...slider,
        percentage,
        canAssign: slider.id === "farmers" ? false : true,
      };
    });

    setSliders(newSliders);
  }, [workingPopulation, occupationSize]);

  const handleSliderChange = (
    id: keyof OccupationsState["size"],
    newPercentage: number,
  ) => {
    if (!sliders.find((s) => s.id === id)?.isAvailable) return;
    if (workingPopulation === 0) return;

    newPercentage = Math.max(0, Math.min(100, newPercentage));

    const currentSlider = sliders.find((s) => s.id === id)!;
    const percentageDiff = newPercentage - currentSlider.percentage;

    if (percentageDiff === 0) return;

    const adjustableSliders = sliders.filter(
      (s) => s.id !== id && s.isAvailable && s.canAssign,
    );

    const totalAdjustablePercentage = adjustableSliders.reduce(
      (sum, s) => sum + s.percentage,
      0,
    );

    const newSliders = sliders.map((slider) => {
      if (slider.id === id) {
        return { ...slider, percentage: newPercentage };
      }
      if (!slider.isAvailable || !slider.canAssign) {
        return slider;
      }

      const adjustmentRatio =
        totalAdjustablePercentage === 0
          ? 0
          : slider.percentage / totalAdjustablePercentage;
      const newSliderPercentage = Math.max(
        0,
        slider.percentage - percentageDiff * adjustmentRatio,
      );

      return { ...slider, percentage: newSliderPercentage };
    });

    const total = newSliders.reduce((sum, s) => sum + s.percentage, 0);
    if (total !== 100) {
      const lastAdjustable = newSliders.findLast(
        (s) => s.isAvailable && s.canAssign && s.id !== id,
      );
      if (lastAdjustable) {
        lastAdjustable.percentage += 100 - total;
      }
    }

    setSliders(newSliders);

    const newOccupationAllocation = { ...occupationAllocation };

    const availableSliders = newSliders.filter((s) => s.isAvailable);
    availableSliders.forEach((slider) => {
      newOccupationAllocation[slider.id] = slider.percentage / 100;
    });

    dispatch(setOccupationAllocation(newOccupationAllocation));
  };

  const hunterSlider = sliders.find((slider) => slider.id === "hunters");
  const gathererSlider = sliders.find((slider) => slider.id === "gatherers");

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-amber-700/30">
        <h2 className="text-xl font-medieval text-amber-200 mb-2">
          Labor Management
        </h2>
        <div className="flex justify-between text-xs text-amber-100/70">
          <div>
            Total Working Population:{" "}
            <span className="text-amber-100">{workingPopulation}</span>
          </div>
          <div>
            Unemployed: <span className="text-amber-100">{unemployed}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto pr-2 p-4">
        {gathererSlider && (
          <GathererSlider
            sliderData={gathererSlider}
            onSliderChange={handleSliderChange}
          />
        )}
        {hunterSlider && (
          <HunterSlider
            sliderData={hunterSlider}
            onSliderChange={handleSliderChange}
          />
        )}
        {sliders
          .filter(
            (slider) => slider.id !== "hunters" && slider.id !== "gatherers",
          )
          .map((slider) => (
            <div
              key={slider.id}
              className={`
                bg-slate-900/50 rounded-lg p-4 border border-amber-700/30
                ${!slider.isAvailable ? "opacity-50" : ""}
              `}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medieval text-amber-200">
                  {slider.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-300">
                    {Math.round(slider.percentage)}%
                  </span>
                  <span className="text-xs text-slate-400">
                    ({Math.floor((slider.percentage / 100) * workingPopulation)}
                    /0 workers)
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={slider.percentage}
                onChange={(e) =>
                  handleSliderChange(slider.id, parseFloat(e.target.value))
                }
                disabled={!slider.isAvailable || !slider.canAssign}
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

              {slider.errorMessage && (
                <p className="text-rose-400 text-xs mt-1">
                  {slider.errorMessage}
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
