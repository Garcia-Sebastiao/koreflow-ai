import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/firebase/task.service";
import { toast } from "sonner";
import type { Task } from "@/types/task.types";
import { performanceService } from "@/services/gemini/performance.service";
import { PERFORMANCE_KEYS } from "../performance/utils/performance.keys";

export function useEvaluateBoard(boardId: string) {
  const queryClient = useQueryClient();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: existingEvaluation } = useQuery({
    queryKey: PERFORMANCE_KEYS.board(boardId),
    queryFn: () => performanceService.getBoardEvaluation(boardId),
    enabled: !!boardId,
  });

  const evaluateBoard = async (boardTitle: string, tasks: Task[]) => {
    if (!tasks.length) {
      toast.error("Não há tarefas para avaliar.");
      return;
    }

    setIsEvaluating(true);
    try {
      const commentsEntries = await Promise.all(
        tasks.map(async (t) => {
          const comments = await taskService.listComments(t.id);
          return [t.id, comments] as const;
        }),
      );
      const commentsMap = Object.fromEntries(commentsEntries);

      const evaluation = await performanceService.evaluateBoard(
        boardId,
        boardTitle,
        tasks,
        commentsMap,
      );

      queryClient.setQueryData(PERFORMANCE_KEYS.board(boardId), evaluation);
      setIsModalOpen(true);
      toast.success("Avaliação do board concluída!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar avaliação do board.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    evaluateBoard,
    isEvaluating,
    isModalOpen,
    setIsModalOpen,
    existingEvaluation,
    hasEvaluation: !!existingEvaluation,
  };
}
