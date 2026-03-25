import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { boardService } from "@/services/firebase/board.service";
import { toast } from "sonner";
import { BOARD_KEYS } from "./utils/board.keys";

export function useDeleteBoard(workspaceId: string) {
  const queryClient = useQueryClient();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const handleDelete = async (boardId: string) => {
    setIsDeletingId(boardId);
    try {
      await boardService.deleteBoard(boardId);

      await queryClient.invalidateQueries({
        queryKey: BOARD_KEYS.list(workspaceId),
      });

      toast.success("Quadro eliminado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao eliminar quadro.");
    } finally {
      setIsDeletingId(null);
    }
  };

  return { handleDelete, isDeletingId };
}