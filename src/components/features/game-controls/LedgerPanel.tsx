import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import TimeDisplay from "./TimeDisplay";
import { Tooltip } from "@/components/ui/Tooltip";

const LedgerPanel = () => {
  const food = useAppSelector((state) => state.resources.food);
  const totalPopulation = useAppSelector(
    (state) => state.populationCohorts.total,
  );
  const foodProduction = useAppSelector(
    (state) => state.resources.foodProduction,
  );
  const baseConsumption = useAppSelector(
    (state) => state.resources.newFoodConsumption,
  );
  const netFoodChangePerSecond = foodProduction - baseConsumption;
  const isStarving = food === 0;

  const foodSecurityScore = useAppSelector(
    (state) => state.game.foodSecurityScore,
  );
  const housingScore = useAppSelector((state) => state.game.housingScore);

  const populationCohorts = useAppSelector(
    (state) => state.populationCohorts.cohorts,
  );
  const childrenPopulation = Object.values(populationCohorts)
    .filter((cohort) => cohort.ageGroup === "children")
    .reduce((sum, cohort) => sum + cohort.size, 0);
  const previousChildrenPopulation = Object.values(populationCohorts)
    .filter((cohort) => cohort.ageGroup === "children")
    .reduce((sum, cohort) => sum + cohort.statistics.previousSize, 0);
  const adultPopulation = Object.values(populationCohorts)
    .filter((cohort) => cohort.ageGroup === "adults")
    .reduce((sum, cohort) => sum + cohort.size, 0);
  const previousAdultPopulation = Object.values(populationCohorts)
    .filter((cohort) => cohort.ageGroup === "adults")
    .reduce((sum, cohort) => sum + cohort.statistics.previousSize, 0);
  const elderPopulation = Object.values(populationCohorts)
    .filter((cohort) => cohort.ageGroup === "elders")
    .reduce((sum, cohort) => sum + cohort.size, 0);
  const previousElderPopulation = Object.values(populationCohorts)
    .filter((cohort) => cohort.ageGroup === "elders")
    .reduce((sum, cohort) => sum + cohort.statistics.previousSize, 0);

  const previousTotalPopulation =
    previousChildrenPopulation +
    previousAdultPopulation +
    previousElderPopulation;
  const totalPopulationChange = totalPopulation - previousTotalPopulation;

  const childrenPopulationChange =
    childrenPopulation - previousChildrenPopulation;
  const adultPopulationChange = adultPopulation - previousAdultPopulation;
  const elderPopulationChange = elderPopulation - previousElderPopulation;

  const [populationHistory, setPopulationHistory] = useState<number[]>([]);
  const historyLength = 30;

  useEffect(() => {
    if (previousTotalPopulation > 0) {
      setPopulationHistory((prevHistory) => {
        const newHistory = [...prevHistory, totalPopulation];
        return newHistory.slice(-historyLength);
      });
    }
  }, [totalPopulation, previousTotalPopulation]);

  const calculateGrowthRate = (): { rate: number; isPositive: boolean } => {
    if (populationHistory.length < 2) return { rate: 0, isPositive: true };

    const oldestValue = populationHistory[0];
    const newestValue = populationHistory[populationHistory.length - 1];

    if (oldestValue === 0) return { rate: 0, isPositive: true };

    const growthRate = ((newestValue - oldestValue) / oldestValue) * 100;
    return {
      rate: Math.abs(growthRate),
      isPositive: growthRate >= 0,
    };
  };

  const resources = [
    { name: "Gold", icon: "💰", amount: 0, change: 0 },
    { name: "Food", icon: "🌾", amount: food, change: netFoodChangePerSecond },
    { name: "Stone", icon: "🪨", amount: 0, change: 0 },
    { name: "Wood", icon: "🪵", amount: 0, change: 0 },
    { name: "Hides", icon: "🦊", amount: 0, change: 0 },
  ];

  // Determine warning levels based on security scores
  const getSecurityWarningLevel = (score: number) => {
    if (score >= 1) return "none";
    if (score >= 0.7) return "mild";
    if (score >= 0.4) return "moderate";
    return "severe";
  };

  const effectiveFoodWarningLevel = isStarving
    ? "severe"
    : getSecurityWarningLevel(foodSecurityScore || 1);
  const housingWarningLevel = getSecurityWarningLevel(housingScore || 1);

  const combinedWarningLevel = ["none", "mild", "moderate", "severe"].reduce(
    (highest, current) => {
      if (
        [effectiveFoodWarningLevel, housingWarningLevel].includes(current) &&
        ["none", "mild", "moderate", "severe"].indexOf(current) >
          ["none", "mild", "moderate", "severe"].indexOf(highest)
      ) {
        return current;
      }
      return highest;
    },
    "none" as string,
  );

  const getWarningBorderClass = (warningLevel: string) => {
    switch (warningLevel) {
      case "mild":
        return "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse-slow";
      case "moderate":
        return "border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)] animate-pulse-medium";
      case "severe":
        return "border-rose-600 shadow-[0_0_16px_rgba(225,29,72,0.5)] animate-pulse-fast";
      default:
        return "border-amber-700/30";
    }
  };

  const getWarningBackgroundClass = (warningLevel: string) => {
    switch (warningLevel) {
      case "mild":
        return "bg-amber-900/20";
      case "moderate":
        return "bg-orange-900/30";
      case "severe":
        return "bg-gradient-to-r from-slate-800 via-rose-900/40 to-slate-800";
      default:
        return "";
    }
  };

  const getHeaderClass = (warningLevel: string) => {
    switch (warningLevel) {
      case "mild":
        return "text-amber-300 relative";
      case "moderate":
        return "text-orange-300 relative";
      case "severe":
        return "text-rose-300 animate-pulse-medium relative";
      default:
        return "text-amber-200";
    }
  };

  const getWarningIcon = () => {
    if (
      effectiveFoodWarningLevel !== "none" &&
      housingWarningLevel !== "none"
    ) {
      return "⚠️";
    } else if (effectiveFoodWarningLevel !== "none") {
      return "🌾";
    } else if (housingWarningLevel !== "none") {
      return "🏠";
    } else {
      return "";
    }
  };

  return (
    <div className="w-56 h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-950 border-r-2 border-amber-700/30 relative">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f0d291_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none"></div>

      <div className="h-8 flex items-center justify-center border-b border-amber-700/30 bg-gradient-to-r from-amber-900/20 via-amber-800/20 to-amber-900/20">
        <h1 className="text-xs font-medieval tracking-widest text-amber-300/90 uppercase">
          Tribal Ledger
        </h1>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-amber-700/30">
        <TimeDisplay />
      </div>

      <div className="flex-1 p-3 space-y-3 overflow-auto">
        <div
          className={`
            bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg 
            overflow-hidden relative transition-all duration-300
            ${getWarningBackgroundClass(combinedWarningLevel)}
            border ${getWarningBorderClass(combinedWarningLevel)}
          `}
        >
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-amber-500/20 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-amber-500/20 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-amber-500/20 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-500/20 rounded-br-lg" />

          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <Tooltip
                content="Total population of your settlement, including children, adults and elders. Changes are shown from the last game tick."
                position="bottom"
                width="220px"
              >
                <h2 className="text-xs font-medieval tracking-wider text-amber-200 uppercase cursor-help">
                  Population
                </h2>
              </Tooltip>

              {/* Warning indicators */}
              {combinedWarningLevel !== "none" && (
                <div className="flex items-center gap-1">
                  {effectiveFoodWarningLevel !== "none" && (
                    <Tooltip
                      content={`Food security is ${effectiveFoodWarningLevel}. Your people may suffer from increased death rates.`}
                      position="bottom"
                      width="220px"
                    >
                      <span
                        className={`
                        text-xs p-1 rounded-full 
                        ${
                          effectiveFoodWarningLevel === "severe"
                            ? "text-rose-400"
                            : effectiveFoodWarningLevel === "moderate"
                              ? "text-orange-400"
                              : "text-amber-400"
                        }
                      `}
                      >
                        {getWarningIcon()}
                      </span>
                    </Tooltip>
                  )}
                  {housingWarningLevel !== "none" && (
                    <Tooltip
                      content={`Housing shortage is ${housingWarningLevel}. Your people may suffer from increased death rates and reduced fertility.`}
                      position="bottom"
                      width="220px"
                    >
                      <span
                        className={`
                        text-xs p-1 rounded-full 
                        ${
                          housingWarningLevel === "severe"
                            ? "text-rose-400"
                            : housingWarningLevel === "moderate"
                              ? "text-orange-400"
                              : "text-amber-400"
                        }
                      `}
                      >
                        {getWarningIcon()}
                      </span>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="bg-slate-800/60 px-2.5 py-1 rounded border border-amber-700/40">
                <p className="text-xl font-bold text-amber-300 font-medieval">
                  {totalPopulation}
                </p>
              </div>

              <span
                className={`text-sm font-medieval font-bold ${
                  totalPopulationChange >= 0
                    ? "text-emerald-400/90"
                    : "text-rose-400/90"
                }`}
              >
                {totalPopulationChange >= 0 ? "+" : ""}
                {totalPopulationChange}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Tooltip
                  content="Children are dependent members of your tribe. They require resources but don't contribute to labor."
                  position="bottom"
                  width="220px"
                >
                  <span className="text-xs text-slate-300 font-medieval cursor-help">
                    Children
                  </span>
                </Tooltip>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-amber-200 bg-slate-800/80 px-1.5 py-0.5 rounded border border-amber-700/30">
                    {childrenPopulation}
                  </span>
                  <span
                    className={`text-xs font-medieval ml-1 ${
                      childrenPopulationChange > 0
                        ? "text-emerald-400/90"
                        : childrenPopulationChange < 0
                          ? "text-rose-400/90"
                          : "text-slate-400/90"
                    }`}
                  >
                    {childrenPopulationChange > 0
                      ? "↑"
                      : childrenPopulationChange < 0
                        ? "↓"
                        : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Tooltip
                  content="Adults are the productive workforce of your tribe. They gather resources, hunt, and perform other essential tasks."
                  position="bottom"
                  width="220px"
                >
                  <span className="text-xs text-slate-300 font-medieval cursor-help">
                    Adults
                  </span>
                </Tooltip>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-amber-200 bg-slate-800/80 px-1.5 py-0.5 rounded border border-amber-700/30">
                    {adultPopulation}
                  </span>
                  <span
                    className={`text-xs font-medieval ml-1 ${
                      adultPopulationChange > 0
                        ? "text-emerald-400/90"
                        : adultPopulationChange < 0
                          ? "text-rose-400/90"
                          : "text-slate-400/90"
                    }`}
                  >
                    {adultPopulationChange > 0
                      ? "↑"
                      : adultPopulationChange < 0
                        ? "↓"
                        : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Tooltip
                  content="Elders are the experienced members of your tribe. They provide wisdom but have reduced productivity compared to adults."
                  position="bottom"
                  width="220px"
                >
                  <span className="text-xs text-slate-300 font-medieval cursor-help">
                    Elders
                  </span>
                </Tooltip>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-amber-200 bg-slate-800/80 px-1.5 py-0.5 rounded border border-amber-700/30">
                    {elderPopulation}
                  </span>
                  <span
                    className={`text-xs font-medieval ml-1 ${
                      elderPopulationChange > 0
                        ? "text-emerald-400/90"
                        : elderPopulationChange < 0
                          ? "text-rose-400/90"
                          : "text-slate-400/90"
                    }`}
                  >
                    {elderPopulationChange > 0
                      ? "↑"
                      : elderPopulationChange < 0
                        ? "↓"
                        : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning container with fixed height to prevent layout shift */}
            <div className="h-[42px] mt-2">
              {combinedWarningLevel !== "none" ? (
                <div
                  className={`
                  p-2 rounded-lg text-xs font-medieval flex items-center gap-2
                  ${
                    combinedWarningLevel === "severe"
                      ? "bg-rose-900/40 border border-rose-800/70 text-rose-300"
                      : combinedWarningLevel === "moderate"
                        ? "bg-orange-900/30 border border-orange-800/60 text-orange-300"
                        : "bg-amber-900/20 border border-amber-800/50 text-amber-300"
                  }
                `}
                >
                  <span className="text-base">
                    {combinedWarningLevel === "severe" ? "⚠️" : "⚠"}
                  </span>
                  <span>
                    {effectiveFoodWarningLevel !== "none" &&
                    housingWarningLevel !== "none"
                      ? "Food and housing problems detected!"
                      : effectiveFoodWarningLevel !== "none"
                        ? isStarving
                          ? "Your people are starving!"
                          : "Food shortage detected!"
                        : "Housing shortage detected!"}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-amber-700/30 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-amber-500/20 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-amber-500/20 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-amber-500/20 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-500/20 rounded-br-lg" />

          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medieval tracking-wider text-amber-200 uppercase">
                Resources
              </h2>
            </div>

            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.name}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base w-5">{resource.icon}</span>
                    <span className="text-sm text-slate-200 font-medieval">
                      {resource.amount.toFixed(1)}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medieval ${
                      resource.change >= 0
                        ? "text-emerald-400/90 group-hover:text-emerald-300"
                        : "text-rose-400/90 group-hover:text-rose-300"
                    }`}
                  >
                    {resource.change >= 0 ? "+" : ""}
                    {resource.change.toFixed(1)}/s
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[42px] mt-3">
              {/* Placeholder for layout stability */}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
    </div>
  );
};

export default LedgerPanel;
