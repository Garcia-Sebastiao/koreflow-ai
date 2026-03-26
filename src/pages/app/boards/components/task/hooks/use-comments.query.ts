import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/firebase/task.service";
import { TASK_KEYS } from "../utils/task.keys";

export function useCommentsQuery(taskId: string) {
  return useQuery({
    queryKey: TASK_KEYS.comments(taskId),
    queryFn: async () => {
      try {
        const comments = await taskService.listComments(taskId);
        return comments;
      } catch (errors) {
        console.log("Error fetching comments", errors);
      }
    },
    enabled: !!taskId,
  });
}
