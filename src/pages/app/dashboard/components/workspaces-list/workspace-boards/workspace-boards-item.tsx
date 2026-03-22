import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { BaseDropdown } from "@/components/shared/base-dropdown/base-dropdown";
import { ConfirmModal } from "@/components/shared/modal/confirm-modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { TrashIcon, UserStarIcon } from "lucide-react";
import { useState } from "react";

export function WorkspaceBoardsItem() {
  const [modalType, setModalType] = useState<"delete" | "leader" | undefined>(
    undefined,
  );
  const { isOpen, onClose, onOpen } = useOpen();
  const handleClose = () => {
    onClose();
    setModalType(undefined);
  };

  const handleOpen = (type: "delete" | "leader") => {
    onOpen();

    if (type == "delete") {
      setModalType(type);
      return;
    }

    setModalType(type);
  };
  return (
    <>
      <div className="flex p-2 rounded-lg hover:bg-gray-100 transition-all items-center justify-between">
        <div className="flex items-center gap-x-4">
          <BaseAvatar
            src="https://yt3.ggpht.com/nOZ7FSHGscNGp4-kb87a4aF0sM0_SzLwNW2r7Au8eDP8XQliIOwB9I1Lq6mkcs6OJJmVPdHV=s88-c-k-c0x00ffffff-no-rj"
            className="w-8 h-8"
            name=""
          />

          <div className="flex flex-col">
            <span className="font-medium text-gray-700">Frontend Dev.</span>

            <span className="font-medium text-xs text-gray-500">
              (03) Membros - (12) Tarefas
            </span>
          </div>
        </div>

        <BaseDropdown>
          <div className="flex flex-col">
            <Button
              onClick={() => handleOpen("delete")}
              className="text-gray-500 hover:text-red-500 justify-start bg-transparent hover:bg-red-500/10"
            >
              <TrashIcon />
              Remover
            </Button>

            <Button
              onClick={() => handleOpen("leader")}
              className="text-gray-500 hover:text-primary justify-start bg-transparent hover:bg-primary/10"
            >
              <UserStarIcon />
              Colocar como Líder
            </Button>
          </div>
        </BaseDropdown>
      </div>

      {isOpen && (
        <ConfirmModal
          danger={modalType == "delete"}
          onConfirm={() => {}}
          title={modalType == "delete" ? "Remover membro?" : "Torner líder"}
          label={
            modalType == "delete"
              ? "Tem certeza que pretende remover este membro?"
              : "Tem certeza que pretende tornar este membro em líder"
          }
          onClose={handleClose}
        />
      )}
    </>
  );
}
