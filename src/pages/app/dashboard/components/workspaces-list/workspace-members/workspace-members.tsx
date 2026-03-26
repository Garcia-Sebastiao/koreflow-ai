import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { LinkIcon, UsersIcon } from "lucide-react";
import { useState } from "react";
import { useMembersQuery } from "./hooks/use-members.query";
import { useUserSearch } from "./hooks/use-user-serach";
import {
  BaseSelectInput,
  type SelectItem,
} from "@/components/shared/input/base-select-input/base-select-input";
import { MemberItem } from "./member-item";
import { AddMemberModal } from "./add-member/add-member-modal";
import { useManageMembers } from "./hooks/use-manage-members";
import { useGetMemberByUser } from "../hooks/members.query";

export function WorkspaceMembers({ workspaceId }: { workspaceId: string }) {
  const { isOpen, onOpen, onClose } = useOpen();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useOpen();
  const { member } = useGetMemberByUser({ workspaceId });

  const [selectedUser, setSelectedUser] = useState<SelectItem | null>(null);

  const { data: members = [] } = useMembersQuery(workspaceId);
  const { removeMember, promoteToLeader, loadingId } =
    useManageMembers(workspaceId);

  const existingIds = members.map((m) => m.userId);
  const { results, isSearching, setTerm } = useUserSearch(existingIds);

  const handleSelect = (item: SelectItem) => {
    setSelectedUser(item);
    onAddOpen();
  };

  const handleAddClose = () => {
    setSelectedUser(null);
    onAddClose();
  };

  const authorized = member?.role == "admin";

  return (
    <>
      <Button onClick={onOpen} className="bg-gray-100 text-gray-500 text-sm">
        <UsersIcon className="size-5 text-gray-500" />
        Membros ({members.length})
      </Button>

      <BaseModal isOpen={isOpen} onClose={onClose}>
        <div className="w-full flex flex-col gap-y-6">
          <h4 className="font-semibold text-gray-700 text-xl">
            Membros do Ambiente de Trabalho
          </h4>

          {authorized && (
            <BaseSelectInput
              mode="single"
              label="Adicionar membro"
              placeholder="Pesquisar por nome ou email..."
              data={results}
              value={null}
              isLoading={isSearching}
              onSearch={setTerm}
              onChange={(item) => item && handleSelect(item)}
            />
          )}

          <div className="flex flex-col gap-y-2">
            <h6 className="text-lg font-semibold text-gray-700">
              Adicionados ({members.length})
            </h6>

            <div className="flex flex-col">
              {members.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  isLoading={loadingId === member.userId}
                  onRemove={() => removeMember(member.userId, member.name)}
                  onPromote={() => promoteToLeader(member.userId, member.name)}
                />
              ))}
            </div>

            {authorized && (
              <Button
                variant="ghost"
                className="w-auto self-start hover:bg-transparent text-gray-500 hover:text-gray-700"
              >
                <LinkIcon />
                Convidar via link
              </Button>
            )}
          </div>
        </div>
      </BaseModal>

      <AddMemberModal
        isOpen={isAddOpen}
        onClose={handleAddClose}
        workspaceId={workspaceId}
        selectedUser={selectedUser}
      />
    </>
  );
}
