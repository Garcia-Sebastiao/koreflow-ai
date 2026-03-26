export const PERFORMANCE_KEYS = {
  task: (taskId: string) => ["performance", "task", taskId] as const,
};