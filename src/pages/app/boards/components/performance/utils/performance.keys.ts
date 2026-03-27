export const PERFORMANCE_KEYS = {
  task: (taskId: string) => ["performance", "task", taskId] as const,
  board: (boardId: string) => ["performance", "board", boardId] as const,
  boardHistory: (boardId: string) => ["performance", "board", boardId, "history"] as const,
};