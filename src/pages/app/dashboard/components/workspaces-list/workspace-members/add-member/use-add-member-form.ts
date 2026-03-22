import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMemberSchema, type AddMemberFormData } from "./add-member.schema";
import type { SelectItem } from "@/components/shared/input/base-select-input/base-select-input";
import type { User } from "@/types/user.types";
import type { UserRole } from "@/types/organization.types";
import { useManageMembers } from "../hooks/use-manage-members";

export function useAddMemberForm(
  workspaceId: string,
  selectedUser: SelectItem | null,
  onSuccess: () => void,
) {
  const { addMember, loadingId } = useManageMembers(workspaceId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addMemberSchema),
    defaultValues: { role: "dev", title: "" },
  });

  const onSubmit = async (data: AddMemberFormData) => {
    if (!selectedUser) return;

    const user: User = {
      uid: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email ?? "",
      avatar: selectedUser.avatar,
      createdAt: "",
    };

    await addMember(user, data.role as UserRole, data.title);
    reset();
    onSuccess();
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    errors,
    isSubmitting,
    isLoading: !!loadingId,
  };
}
