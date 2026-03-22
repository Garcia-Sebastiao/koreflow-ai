import { Outlet } from "react-router";
import { WorkspaceHeader } from "./components/workspace-header/workspace-header";

export function WorkspacePage() {
  return (
    <div className="w-full flex flex-col h-full">
      <WorkspaceHeader />
      <Outlet />
    </div>
  );
}
