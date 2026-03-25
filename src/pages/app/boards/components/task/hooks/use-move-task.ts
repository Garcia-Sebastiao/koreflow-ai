import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { taskService } from "@/services/firebase/task.service";
import { toast } from "sonner";
import type { Task } from "@/types/task.types";
import type { TaskStatus } from "@/types/board.types";
import { TASK_KEYS } from "../utils/task.keys";

export function useMoveTask(boardId: string) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [rejectionTask, setRejectionTask] = useState<Task | null>(null);

  const moveTask = async (task: Task, newStatus: TaskStatus, rejectionNote?: string) => {
    if (!user) return;

    const isQaRejection =
      (task.status === "testing" || task.status === "to_test") &&
      (newStatus === "todo" || newStatus === "doing");

    if (isQaRejection && !rejectionNote) {
      setRejectionTask(task);
      return;
    }

    try {
      const updates = await taskService.moveTask(task, newStatus, {
        userId: user.uid,
        userName: user.name,
      });

      if (isQaRejection && rejectionNote) {
        await taskService.addComment(task.id, {
          taskId: task.id,
          userId: user.uid,
          userName: user.name,
          userAvatar: user.avatar,
          content: rejectionNote,
          type: "rejection",
        });

        await queryClient.invalidateQueries({
          queryKey: TASK_KEYS.comments(task.id),
        });
      }

      queryClient.setQueryData<Task[]>(
        TASK_KEYS.list(boardId),
        (old) => old?.map((t) => (t.id === task.id ? { ...t, ...updates } : t)) ?? []
      );

      toast.success("Tarefa movida!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao mover tarefa.");
    }
  };

  const clearRejection = () => setRejectionTask(null);

  return { moveTask, rejectionTask, clearRejection };
}