import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { User } from "@/types/user.types";
import type { UserRole } from "@/types/organization.types";
import { MEMBER_KEYS } from "../hooks/use-members.keys";
import { memberService } from "@/services/firebase/member.service";

export function useManageMembers(workspaceId: string) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.list(workspaceId) });

  const addMember = useCallback(
    async (targetUser: User, role: UserRole = "dev", title?: string) => {
      setLoadingId(targetUser.uid);

      try {
        console.log("Adicionando membro:", { targetUser, role, title });
        await memberService.addMember(targetUser, workspaceId, role, title);
        await invalidate();
        toast.success(`${targetUser.name} adicionado com sucesso!`);
      } catch (error) {
        console.error("Erro ao adicionar membro:", error);
        toast.error("Erro ao adicionar membro.");
      } finally {
        setLoadingId(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceId],
  );

  const removeMember = useCallback(
    async (userId: string, name: string) => {
      setLoadingId(userId);
      try {
        await memberService.removeMember(userId, workspaceId);
        await invalidate();
        toast.success(`${name} removido com sucesso!`);
      } catch {
        toast.error("Erro ao remover membro.");
      } finally {
        setLoadingId(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceId],
  );

  const promoteToLeader = useCallback(
    async (userId: string, name: string) => {
      setLoadingId(userId);
      try {
        await memberService.updateRole(userId, workspaceId, "leader");
        await invalidate();
        toast.success(`${name} é agora Líder!`);
      } catch {
        toast.error("Erro ao atualizar role.");
      } finally {
        setLoadingId(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceId],
  );

  return {
    currentUserId: user?.uid,
    loadingId,
    addMember,
    removeMember,
    promoteToLeader,
  };
}
