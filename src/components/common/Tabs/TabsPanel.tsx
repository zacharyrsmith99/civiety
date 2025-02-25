import React from "react";
import { TabPanelProps } from "./types";

export const TabPanel = ({ tabId, activeTab, children }: TabPanelProps) => {
  if (tabId !== activeTab) return null;

  return <div className="h-full">{children}</div>;
};
