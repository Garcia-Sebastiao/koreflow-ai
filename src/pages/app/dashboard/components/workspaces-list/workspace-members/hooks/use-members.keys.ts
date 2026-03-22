export const MEMBER_KEYS = {
  all: ["members"] as const,
  list: (workspaceId: string) => ["members", "list", workspaceId] as const,
};