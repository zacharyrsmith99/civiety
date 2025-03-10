import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getWorkingAgePopulation } from "@/store/middleware/util/stateInformationHelper";
import {
  OccupationsState,
  setOccupationAllocation,
  setOccupationLockStatus,
} from "@/store/slices/occupationsSlice";
import { HunterSlider } from "./components/HunterSlider";
import { GathererSlider } from "./components/GathererSlider";
import { LaborerSlider } from "./components/LaborerSlider";

interface OccupationSlider {
  id: keyof OccupationsState["size"];
  label: string;
  percentage: number;
  canAssign: boolean;
  isAvailable: boolean;
  locked: boolean;
  errorMessage?: string;
}

export const LaborManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const workingPopulation = useAppSelector(getWorkingAgePopulation);
  const {
    size: occupationSize,
    occupationAllocation,
    lockStatus,
  } = useAppSelector((state) => state.occupations);

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
      locked: false,
    },
    {
      id: "farmers",
      label: "Farmers",
      percentage: 0,
      canAssign: true,
      isAvailable: true,
      locked: false,
    },
    {
      id: "hunters",
      label: "Hunters",
      percentage: 0,
      canAssign: true,
      isAvailable: true,
      locked: false,
    },
    {
      id: "laborers",
      label: "Laborers",
      percentage: 0,
      canAssign: true,
      isAvailable: true,
      locked: false,
    },
    {
      id: "soldiers",
      label: "Soldiers",
      percentage: 0,
      canAssign: false,
      isAvailable: false,
      errorMessage: "Not yet available",
      locked: false,
    },
    {
      id: "coalMiners",
      label: "Coal Miners",
      percentage: 0,
      canAssign: false,
      isAvailable: false,
      errorMessage: "Not yet available",
      locked: false,
    },
    {
      id: "woodcutters",
      label: "Woodcutters",
      percentage: 0,
      canAssign: false,
      isAvailable: false,
      errorMessage: "Not yet available",
      locked: false,
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
        locked: lockStatus?.[slider.id] || false,
      };
    });

    setSliders(newSliders);
  }, [workingPopulation, occupationSize, lockStatus]);

  const handleToggleLock = (id: keyof OccupationsState["size"]) => {
    const currentLockStatus = sliders.find((s) => s.id === id)?.locked || false;
    dispatch(setOccupationLockStatus({ id, locked: !currentLockStatus }));

    setSliders((prevSliders) =>
      prevSliders.map((slider) =>
        slider.id === id ? { ...slider, locked: !slider.locked } : slider,
      ),
    );
  };

  const handleSliderChange = (
    id: keyof OccupationsState["size"],
    newPercentage: number,
  ) => {
    if (!sliders.find((s) => s.id === id)?.isAvailable) return;
    if (workingPopulation === 0) return;

    const lockedPercentage = sliders.reduce(
      (sum, s) => (s.locked && s.id !== id ? sum + s.percentage : sum),
      0,
    );

    const maxAllowedPercentage = 100 - lockedPercentage;

    newPercentage = Math.max(0, Math.min(maxAllowedPercentage, newPercentage));

    const currentSlider = sliders.find((s) => s.id === id)!;
    const percentageDiff = newPercentage - currentSlider.percentage;

    if (percentageDiff === 0) return;

    const adjustableSliders = sliders.filter(
      (s) => s.id !== id && s.isAvailable && s.canAssign && !s.locked,
    );

    const totalAdjustablePercentage = adjustableSliders.reduce(
      (sum, s) => sum + s.percentage,
      0,
    );

    const newSliders = sliders.map((slider) => {
      if (slider.id === id) {
        return { ...slider, percentage: newPercentage };
      }

      if (!slider.isAvailable || !slider.canAssign || slider.locked) {
        return slider;
      }

      let newSliderPercentage;
      if (totalAdjustablePercentage <= 0) {
        newSliderPercentage =
          (100 - newPercentage - lockedPercentage) / adjustableSliders.length;
      } else {
        const adjustmentRatio = slider.percentage / totalAdjustablePercentage;
        newSliderPercentage = Math.max(
          0,
          slider.percentage - percentageDiff * adjustmentRatio,
        );
      }

      return { ...slider, percentage: newSliderPercentage };
    });

    const total = newSliders.reduce((sum, s) => sum + s.percentage, 0);
    if (Math.abs(total - 100) > 0.01) {
      const adjustableSlider = newSliders.find(
        (s) => s.isAvailable && s.canAssign && !s.locked && s.id !== id,
      );

      if (adjustableSlider) {
        adjustableSlider.percentage += 100 - total;
      } else {
        const currentSlider = newSliders.find((s) => s.id === id);
        if (currentSlider) {
          currentSlider.percentage += 100 - total;
        } else {
          return;
        }
      }
    }

    newSliders.forEach((slider) => {
      if (slider.percentage < 0) slider.percentage = 0;
    });

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
  const laborerSlider = sliders.find((slider) => slider.id === "laborers");
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
            onToggleLock={handleToggleLock}
          />
        )}
        {hunterSlider && (
          <HunterSlider
            sliderData={hunterSlider}
            onSliderChange={handleSliderChange}
            onToggleLock={handleToggleLock}
          />
        )}
        {laborerSlider && (
          <LaborerSlider
            sliderData={laborerSlider}
            onSliderChange={handleSliderChange}
            onToggleLock={handleToggleLock}
          />
        )}
        {sliders
          .filter(
            (slider) =>
              slider.id !== "hunters" &&
              slider.id !== "gatherers" &&
              slider.id !== "laborers",
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
                disabled={
                  !slider.isAvailable || !slider.canAssign || slider.locked
                }
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
