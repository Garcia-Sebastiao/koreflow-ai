import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Task, TaskComment } from "@/types/task.types";
import { performanceService } from "@/services/gemini/performance.service";
import { PERFORMANCE_KEYS } from "./utils/performance.keys";
import { queryClient } from "@/config/client.config";

export function useEvaluateTask(taskId: string) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: existingEvaluation, isPending: isGettingEvaluation } = useQuery(
    {
      queryKey: PERFORMANCE_KEYS.task(taskId),
      queryFn: () => performanceService.getEvaluation(taskId),
      enabled: !!taskId,
    },
  );

  const evaluateTask = async (task: Task, comments: TaskComment[]) => {
    setIsEvaluating(true);
    try {
      const evaluation = await performanceService.evaluateTask(task, comments);
      queryClient.setQueryData(PERFORMANCE_KEYS.task(taskId), evaluation);
      setIsModalOpen(true);
      toast.success("Avaliação concluída!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar avaliação.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const openExisting = () => {
    if (existingEvaluation) setIsModalOpen(true);
  };

  return {
    evaluateTask,
    openExisting,
    isEvaluating,
    isModalOpen,
    setIsModalOpen,
    existingEvaluation,
    hasEvaluation: !!existingEvaluation,
    isGettingEvaluation,
  };
}
