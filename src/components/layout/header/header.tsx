import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { BaseInput } from "@/components/shared/input/base-input";
import { useAuthStore } from "@/store/auth.store";
import { limitStringWithDots } from "@/utils/limitStringsWithDots";
import { BellIcon, InboxIcon, SearchIcon } from "lucide-react";

export function Header() {
  const { user } = useAuthStore();
  
  return (
    <header className="w-full py-4 px-8 border-b-2 border-b-border/50 h-17.5 flex items-center justify-between">
      <BaseInput
        className="max-w-xs border-none bg-gray-100"
        leftElement={<SearchIcon className="size-5 text-gray-400" />}
        placeholder="Procurar"
      />

      <div className="flex items-center gap-x-6">
        <InboxIcon className="size-5 text-gray-400" />
        <BellIcon className="size-5 text-gray-400" />

        <div className="flex gap-x-2 items-center">
          <BaseAvatar name={user?.name as string} src={user?.avatar} />

          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-700">
              {user?.name}
            </span>

            <span className="font-medium text-xs text-gray-400">
              {limitStringWithDots(user?.email ?? "", 20)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
