// import { TemplatesSuggestions } from "./components/templates-suggestions/templates-suggestions";
// import { NoWorkspaces } from "./components/no-workspaces/no-workspaces";
import { WorkspacesList } from "./components/workspaces-list/workspaces-list";

export function DashboardPage() {
  return (
    <div className="w-full overflow-y-auto relative h-[calc(100dvh-70px)] flex">
      <WorkspacesList />
      {/* <TemplatesSuggestions /> */}
    </div>
  );
}
