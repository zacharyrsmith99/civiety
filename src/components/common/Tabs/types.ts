export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
}
