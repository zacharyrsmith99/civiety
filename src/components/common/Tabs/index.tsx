import React from "react";
import { TabsProps } from "./types";

export const Tabs = ({ tabs, activeTab, onTabChange, children }: TabsProps) => {
  return (
    <div className="h-full flex flex-col bg-card-bg rounded-xl border-2 border-card-border shadow-lg backdrop-blur-sm bg-opacity-90">
      {/* Tab Navigation */}
      <div className="border-b border-card-border/40">
        <div className="flex px-4 pt-3 gap-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-2.5 text-sm font-medium relative
                transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "text-text-accent bg-gradient-to-b from-card-bg to-card-bg/50 border-x-2 border-t-2 border-card-border shadow-lg -mb-px z-10"
                    : "text-text-secondary hover:text-text-accent/90 hover:bg-card-border/10 hover:translate-y-0.5"
                }
                first:rounded-tl-lg last:rounded-tr-lg
                group
                min-w-[10rem] text-center
              `}
            >
              {tab.label}
              {/* Animated underline */}
              {activeTab === tab.id && (
                <div className="absolute inset-x-0 -bottom-px h-0.5 bg-amber-400/40 animate-underline" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6 text-text-primary">
        {children}
      </div>
    </div>
  );
};
