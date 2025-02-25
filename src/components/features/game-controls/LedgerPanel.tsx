import React from "react";
import { useAppSelector } from "@/store/hooks";
import { getCohortPopulation } from "@/store/middleware/util/stateInformationHelper";
import TimeDisplay from "./TimeDisplay";

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

  const adultPopulation = useAppSelector((state) =>
    getCohortPopulation(state, { ageGroup: "adults" }),
  );
  const childrenPopulation = useAppSelector((state) =>
    getCohortPopulation(state, { ageGroup: "children" }),
  );
  const elderPopulation = useAppSelector((state) =>
    getCohortPopulation(state, { ageGroup: "elders" }),
  );

  const resources = [
    { name: "Gold", icon: "💰", amount: 1000, change: 2.5 },
    { name: "Food", icon: "🌾", amount: food, change: netFoodChangePerSecond },
    { name: "Stone", icon: "🪨", amount: 500, change: -1.2 },
    { name: "Wood", icon: "🪵", amount: 750, change: 1.8 },
    { name: "Hides", icon: "🦊", amount: 250, change: 0.5 },
  ];

  return (
    <div className="w-56 h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-950 border-r-2 border-amber-700/30">
      {/* Top decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />

      {/* Time Display */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-amber-700/30">
        <TimeDisplay />
      </div>

      <div className="flex-1 p-3">
        {/* Population Panel */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-amber-700/30 overflow-hidden mb-3 relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-amber-500/20 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-amber-500/20 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-amber-500/20 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-500/20 rounded-br-lg" />

          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👥</span>
              <h2 className="text-xs font-medieval tracking-wider text-amber-200 uppercase">
                Population
              </h2>
            </div>

            <p className="text-2xl font-bold text-amber-300 font-medieval mb-2">
              {totalPopulation}
            </p>

            <div className="space-y-1.5">
              {[
                { label: "Adults", value: adultPopulation },
                { label: "Children", value: childrenPopulation },
                { label: "Elders", value: elderPopulation },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medieval">
                    {label}
                  </span>
                  <span className="text-xs font-medium text-amber-200 bg-slate-800/80 px-1.5 py-0.5 rounded border border-amber-700/30">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Panel */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-amber-700/30 overflow-hidden relative">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-amber-500/20 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-amber-500/20 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-amber-500/20 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-500/20 rounded-br-lg" />

          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📦</span>
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

            {/* Starvation Warning */}
            {isStarving && (
              <div className="mt-3 bg-rose-900/20 border border-rose-800/30 rounded-lg p-2">
                <div className="flex items-center gap-2 text-rose-400">
                  <span>⚠️</span>
                  <span className="text-xs font-medieval">
                    Your people are starving!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
    </div>
  );
};

export default LedgerPanel;
