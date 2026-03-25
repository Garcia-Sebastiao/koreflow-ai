import { BaseModal } from "@/components/shared/modal/modal";
import { BaseInput } from "@/components/shared/input/base-input";
import { Button } from "@/components/ui/button";
import { useCreateBoard } from "./user-create-board";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export function CreateBoardModal({
  isOpen,
  onClose,
  workspaceId,
}: CreateBoardModalProps) {
  const { register, handleSubmit, errors, isSubmitting } = useCreateBoard(
    workspaceId,
    onClose,
  );

  return (
    <BaseModal
      isOpen={isOpen}
      showCloseButton={false}
      onClose={onClose}
      title="Criar Quadro"
      className="max-w-lg!"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6 w-full">
        <BaseInput
          {...register("title")}
          label="Nome do quadro"
          placeholder="Ex: Frontend Dev."
          className="bg-gray-100 border-none"
          error={errors.title?.message}
        />

        <div className="flex gap-x-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="flex-1 h-10"
          >
            Criar Quadro
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
