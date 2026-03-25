import { useQuery } from "@tanstack/react-query";
import { boardService } from "@/services/firebase/board.service";
import { BOARD_KEYS } from "./utils/board.keys";

export function useBoardsQuery(workspaceId: string) {
  return useQuery({
    queryKey: BOARD_KEYS.list(workspaceId),
    queryFn: () => boardService.listBoards(workspaceId),
    enabled: !!workspaceId,
  });
}