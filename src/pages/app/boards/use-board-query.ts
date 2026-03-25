import { useQuery } from "@tanstack/react-query";
import { boardService } from "@/services/firebase/board.service";
import { BOARD_KEYS } from "../dashboard/components/workspaces-list/workspace-boards/utils/board.keys";

export function useBoardQuery(boardId: string) {
  return useQuery({
    queryKey: BOARD_KEYS.detail(boardId),
    queryFn: async () => {
      try {
        const board = await boardService.getBoardById(boardId);
        return board;
      } catch (error) {
        console.error("[useBoardQuery] erro ao buscar board:", error);
        throw error;
      }
    },
    enabled: !!boardId,
  });
}