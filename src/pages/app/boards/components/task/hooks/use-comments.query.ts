import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/firebase/task.service";
import { TASK_KEYS } from "../utils/task.keys";

export function useCommentsQuery(taskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.comments(taskId),
    queryFn: () => taskService.listComments(taskId),
    enabled: !!taskId,
  });
}