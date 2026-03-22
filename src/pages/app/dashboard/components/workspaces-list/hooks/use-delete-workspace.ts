import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WORKSPACE_KEYS } from "../../create-workspace/workspace.keys";
import { workspaceService } from "@/services/firebase/workspace.service";

export function useDeleteWorkspace(workspaceId: string) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await workspaceService.deleteWorkspace(workspaceId, user.uid);

      await queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.list(user.uid),
      });

      toast.success("Ambiente eliminado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao eliminar o ambiente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}