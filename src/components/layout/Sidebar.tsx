import ResourcePanel from "../features/game-controls/LedgerPanel";

export const Sidebar = () => {
  return (
    <div className="h-full bg-sidebar-bg border-r-2 border-sidebar-border">
      <ResourcePanel />
    </div>
  );
};
