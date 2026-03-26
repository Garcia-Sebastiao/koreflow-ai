export const MEMBER_KEYS = {
  all: ["members"] as const,
  memberByUser: (userId: string, workspaceId: string) =>
    ["members", "user", userId, workspaceId] as const,
  list: (workspaceId: string) => ["members", "list", workspaceId] as const,
};
