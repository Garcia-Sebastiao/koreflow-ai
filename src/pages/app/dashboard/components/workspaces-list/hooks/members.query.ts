import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { MEMBER_KEYS } from "../workspace-members/hooks/use-members.keys";
import { memberService } from "@/services/firebase/member.service";

export function useGetMemberByUser({ workspaceId }: { workspaceId: string }) {
  const { user } = useAuthStore();

  const { data: member, isPending: isGettingMemberByUser } = useQuery({
    queryFn: async () => {
      try {
        const response = await memberService.getMemberByUserId(
          user?.uid || "",
          workspaceId,
        );
        return response;
      } catch (error) {
        console.log("Error fetching member by user ID", error);
        return null;
      }
    },
    queryKey: MEMBER_KEYS.memberByUser(user?.uid || "", workspaceId),
  });

  return {
    member,
    isGettingMemberByUser,
  };
}
