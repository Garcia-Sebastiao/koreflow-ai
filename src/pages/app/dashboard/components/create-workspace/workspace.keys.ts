export const WORKSPACE_KEYS = {
  all: ["workspaces"] as const,
  list: (userId: string) => ["workspaces", "list", userId] as const,
  detail: (workspaceId: string) => ["workspaces", "detail", workspaceId] as const,
};