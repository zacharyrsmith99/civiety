import React from "react";
import { useAppSelector } from "@/store/hooks";
import { scrollbarStyles } from "@/config/scrollbarStyles";
export const BuildingQueue: React.FC = () => {
  const buildingQueue = useAppSelector((state) => state.land.buildingQueue);

  if (buildingQueue.length === 0) {
    return (
      <div className="text-center py-6 bg-slate-800/50 rounded-lg p-3 border border-amber-700/30">
        <div className="text-2xl mb-2">🏗️</div>
        <h3 className="text-lg font-medieval text-amber-200 mb-1">
          Building Queue Empty
        </h3>
        <p className="text-amber-100/80 text-sm">
          Select a tile and start construction to see your building queue.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-700/30">
        <h3 className="font-medieval text-amber-200 text-lg mb-2">
          Construction Projects
        </h3>
        <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
          {buildingQueue.map((item, index) => {
            const progressPercent = Math.floor(
              (item.accumulatedLabor / item.initialCost.labor) * 100,
            );
            return (
              <div
                key={index}
                className="bg-slate-700/40 rounded-lg p-2 border border-amber-700/30"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-amber-200 font-medieval">
                      {item.name.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="text-xs text-amber-100/70">
                      Position: ({item.position.x}, {item.position.y}) • Level:{" "}
                      {item.level}
                    </div>
                  </div>
                  <div className="text-xs bg-amber-900/40 rounded px-2 py-1">
                    {progressPercent}%
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-right text-amber-100/70">
                  {item.initialCost.labor - item.remainingCost.labor} /{" "}
                  {item.initialCost.labor} labor
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
