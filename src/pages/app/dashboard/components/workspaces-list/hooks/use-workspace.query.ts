import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { workspaceService } from "@/services/firebase/workspace.service";
import { WORKSPACE_KEYS } from "../../create-workspace/workspace.keys";

export function useWorkspacesQuery() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: WORKSPACE_KEYS.list(user?.uid ?? ""),
    queryFn: () => workspaceService.listWorkspacesByUser(user!.uid),
    enabled: !!user?.uid,
  });
}