import { Logo } from "@/assets/common/logo";
import { CreateWorkspace } from "../create-workspace/create-workspace";
import { NoWorkspaces } from "../no-workspaces/no-workspaces";
import { useWorkspacesQuery } from "./hooks/use-workspace.query";
import { WorkspaceItem } from "./workspace-item/workspace-item";

export function WorkspacesList() {
  const { data: workspaces, isLoading } = useWorkspacesQuery();

  return (
    <div className="w-full flex-1 p-8">
      <div className="gap-y-8 flex flex-1 h-full flex-col w-full mx-auto">
        <div className="w-full flex items-center justify-between">
          <h4 className="text-2xl font-semibold text-gray-700">
            Suas Áreas de Trabalho
          </h4>
          <CreateWorkspace />
        </div>

        {isLoading && (
          <div className="w-full flex-1 flex items-center justify-center flex-col gap-y-4">
            <div className="animate-spin flex-none duration-300">
              <Logo />
            </div>

            <h4 className="text-2xl font-semibold text-gray-700">
              Carregando ambientes.
            </h4>
          </div>
        )}

        {!isLoading && workspaces?.length === 0 && <NoWorkspaces />}

        <div className="flex flex-col gap-y-10">
          {workspaces?.map((workspace) => (
            <WorkspaceItem key={workspace.id} workspace={workspace} />
          ))}
        </div>
      </div>
    </div>
  );
}
