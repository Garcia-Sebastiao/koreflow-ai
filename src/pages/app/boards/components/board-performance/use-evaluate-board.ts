import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/firebase/task.service";
import { toast } from "sonner";
import type { Task } from "@/types/task.types";
import type { BoardPerformanceEvaluation } from "@/types/performance.types";
import { PERFORMANCE_KEYS } from "../performance/utils/performance.keys";
import { performanceService } from "@/services/gemini/performance.service";

type ModalView = "history" | "detail" | null;

export function useEvaluateBoard(boardId: string) {
  const queryClient = useQueryClient();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [modalView, setModalView] = useState<ModalView>(null);
  const [selectedEvaluation, setSelectedEvaluation] =
    useState<BoardPerformanceEvaluation | null>(null);

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: PERFORMANCE_KEYS.boardHistory(boardId),
    queryFn: async () => {
      try {
        const response = performanceService.getBoardEvaluationHistory(boardId);
        return response;
      } catch (error) {
        console.log("Fetching board evaluation history", error);
      }
    },
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

      queryClient.setQueryData<BoardPerformanceEvaluation[]>(
        PERFORMANCE_KEYS.boardHistory(boardId),
        (old) => [evaluation, ...(old ?? [])],
      );

      setSelectedEvaluation(evaluation);
      setModalView("detail");
      toast.success("Avaliação concluída!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar avaliação do board.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const openHistory = () => setModalView("history");

  const openDetail = (evaluation: BoardPerformanceEvaluation) => {
    setSelectedEvaluation(evaluation);
    setModalView("detail");
  };

  const closeModal = () => {
    setModalView(null);
    setSelectedEvaluation(null);
  };

  const backToHistory = () => {
    setSelectedEvaluation(null);
    setModalView("history");
  };

  return {
    evaluateBoard,
    isEvaluating,
    isLoadingHistory,
    history,
    modalView,
    selectedEvaluation,
    openHistory,
    openDetail,
    closeModal,
    backToHistory,
    hasHistory: history.length > 0,
  };
}
