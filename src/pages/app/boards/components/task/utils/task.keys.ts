export const TASK_KEYS = {
  all: ["tasks"] as const,
  list: (boardId: string) => ["tasks", "list", boardId] as const,
  detail: (taskId: string) => ["tasks", "detail", taskId] as const,
  comments: (taskId: string) => ["tasks", "comments", taskId] as const,
};