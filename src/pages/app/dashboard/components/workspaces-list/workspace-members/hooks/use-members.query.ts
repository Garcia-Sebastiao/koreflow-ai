import { memberService } from "@/services/firebase/member.service";
import { useQuery } from "@tanstack/react-query";
import { MEMBER_KEYS } from "./use-members.keys";

export function useMembersQuery(workspaceId: string) {
  return useQuery({
    queryKey: MEMBER_KEYS.list(workspaceId),
    queryFn: () => memberService.listMembers(workspaceId),
    enabled: !!workspaceId,
  });
}