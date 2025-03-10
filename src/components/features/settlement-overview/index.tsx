"use client";
import React, { useState } from "react";
import { Tab } from "@/components/common/Tabs/types";
import { TabPanel } from "@/components/common/Tabs/TabsPanel";
import DataPanel from "../data-visualization";
import { LaborManagement } from "../population/LaborManagement";
import { useAppSelector } from "@/store/hooks";
import { selectTileAt } from "@/store/slices/landSlice";
import { GridPosition } from "@/store/slices/types/land";
import { LandPanel } from "../land/LandPanel";

export const SettlementOverview = ({
  selectedPosition,
  onTileSelect,
}: {
  selectedPosition: GridPosition | null;
  onTileSelect: (position: GridPosition | null) => void;
}) => {
  const [activeTab, setActiveTab] = useState<string>("population");

  const selectedTile = useAppSelector((state) =>
    selectedPosition ? selectTileAt(state, selectedPosition) : null,
  );

  const tabs: Tab[] = [
    { id: "population", label: "Population Management" },
    { id: "land", label: "Land" },
    { id: "data", label: "Statistics" },
  ];

  return (
    <div className="h-full rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 backdrop-blur-md border-2 border-amber-700/30 shadow-2xl shadow-black/50 flex flex-col">
      <div className="px-4 py-2 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-xl border-b-2 border-amber-600/30 shadow-lg relative">
        <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-amber-500/20 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-amber-500/20 rounded-tr-xl" />

        <h2 className="text-lg font-semibold text-amber-100 flex items-center gap-2 px-2">
          <span className="text-amber-400 text-2xl">🏘️</span>
          <span className="font-medieval tracking-wide">
            Settlement Management
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        </h2>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="p-2 pb-0">
          <div className="flex gap-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-lg border border-amber-700/30">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 text-sm font-medium
                  transition-all duration-300
                  relative overflow-hidden group
                  flex-1
                  ${index !== 0 ? "border-l border-amber-700/30" : ""}
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-b from-amber-800/80 to-amber-900/80 text-amber-100"
                      : "text-slate-300 hover:bg-amber-900/20"
                  }
                `}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <div className="w-4 h-px bg-gradient-to-r from-transparent to-amber-400/30" />
                  <span className="font-medieval tracking-wide">
                    {tab.label}
                  </span>
                  <div className="w-4 h-px bg-gradient-to-l from-transparent to-amber-400/30" />
                </div>

                {activeTab === tab.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-600/5 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400/50" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                    <div className="absolute inset-0 bg-amber-400/5" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 p-2">
          <TabPanel tabId="population" activeTab={activeTab}>
            <div className="h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-xl p-3 flex flex-col relative">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-600/20 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-600/20 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-amber-600/20 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-600/20 rounded-br-xl" />

              <div className="relative z-10">
                <LaborManagement />
              </div>
            </div>
          </TabPanel>

          <TabPanel tabId="land" activeTab={activeTab}>
            <div className="h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-xl p-3 flex flex-col relative">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-600/20 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-600/20 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-amber-600/20 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-600/20 rounded-br-xl" />

              <div className="relative z-10">
                <LandPanel
                  selectedTile={selectedTile}
                  selectedPosition={selectedPosition}
                  onTileSelect={onTileSelect}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel tabId="data" activeTab={activeTab}>
            <div className="h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-xl p-3 flex flex-col relative">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-600/20 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-600/20 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-amber-600/20 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-600/20 rounded-br-xl" />

              <div className="relative z-10">
                <DataPanel />
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
};
