import type { Task, TaskComment } from "@/types/task.types";
import { useMutation } from "@tanstack/react-query";

export function useEvaluateTask() {
  const { mutate, isPending: isEvaluating } = useMutation({
    mutationFn: async ({
      task,
      comments,
    }: {
      task: Task;
      comments: TaskComment[];
    }) => {
      const { performanceService } =
        await import("@/services/gemini/performance.service");
      return performanceService.evaluateTask(task, comments);
    },

    onSuccess(evaluation) {
      console.log("Avaliação concluída:", evaluation);
    },
  });

  return {
    evaluateTask: mutate,
    isEvaluating,
  };
}
