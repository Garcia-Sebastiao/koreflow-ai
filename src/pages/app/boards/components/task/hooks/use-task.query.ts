import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/firebase/task.service";
import { TASK_KEYS } from "../utils/task.keys";

export function useTasksQuery(boardId: string, workspaceId: string) {
  return useQuery({
    queryKey: TASK_KEYS.list(boardId),
    queryFn: async () => {
      try {
        const tasks = await taskService.listTasks(boardId, workspaceId);
        return tasks;
      } catch (error) {
        console.error("[useTasksQuery] erro:", error);
        throw error;
      }
    },
    enabled: !!boardId && !!workspaceId,
  });
}

export function useTaskQuery(taskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.detail(taskId),
    queryFn: async () => {
      try {
        const task = await taskService.getTaskById(taskId);
        return task;
      } catch (error) {
        console.error("[useTaskQuery] erro:", error);
        throw error;
      }
    },
    enabled: !!taskId,
  });
}
