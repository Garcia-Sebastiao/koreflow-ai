export const BOARD_KEYS = {
  all: ["boards"] as const,
  list: (workspaceId: string) => ["boards", "list", workspaceId] as const,
  detail: (boardId: string) => ["boards", "detail", boardId] as const,
};