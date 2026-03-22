import { BaseInput } from "@/components/shared/input/base-input";
import { BaseModal } from "@/components/shared/modal/modal";
import { Button } from "@/components/ui/button";
import { useOpen } from "@/hooks/use-open";
import { PlusIcon } from "lucide-react";
import { useCreateWorkspace } from "./use-create-workspace";

export function CreateWorkspace() {
  const { isOpen, onClose, onOpen } = useOpen();
  const { register, handleSubmit, errors, isSubmitting } =
    useCreateWorkspace(onClose);

  return (
    <>
      <Button onClick={onOpen} className="px-8 bg-primary">
        <PlusIcon className="text-white" />
        Criar novo
      </Button>

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-lg!"
        title="Criar Ambiente de Trabalho"
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-6">
          <BaseInput
            {...register("name")}
            className="bg-gray-100 border-none"
            placeholder="Ex: Squad de Desenvolvimento"
            error={errors.name?.message}
          />
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full h-10"
          >
            Criar Ambiente
          </Button>
        </form>
      </BaseModal>
    </>
  );
}
