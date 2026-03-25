import { memberService } from "@/services/firebase/member.service";
import { useQuery } from "@tanstack/react-query";
import { MEMBER_KEYS } from "./use-members.keys";

export function useMembersQuery(workspaceId: string) {
  return useQuery({
    queryKey: MEMBER_KEYS.list(workspaceId),
    queryFn: async () => {
      try {
        const members = await memberService.listMembers(workspaceId);
        return members;
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
        throw error;
      }
    },
    enabled: !!workspaceId,
  });
}
