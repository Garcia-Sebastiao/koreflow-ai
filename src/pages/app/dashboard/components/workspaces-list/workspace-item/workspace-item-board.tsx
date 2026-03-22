import { BaseAvatar } from "@/components/shared/base-avatar/base-avatar";
import { BaseDropdown } from "@/components/shared/base-dropdown/base-dropdown";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

export function WorkspaceItemBoard() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/app/workspace/1/details`)}
      className="flex-1 hover:brightness-90 justify-start text-left transition-all col-span-1 flex flex-col gap-y-4 rounded-2xl bg-gray-100 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <BaseAvatar className="w-8 h-8" name="" />

          <h6 className="text-sm text-gray-700 font-semibold">Frontend Dev.</h6>
        </div>

        <BaseDropdown>
          <div></div>
        </BaseDropdown>
      </div>

      <span className="text-sm text-gray-500">
        Simple board to manage the frontend team and many more.
      </span>

      <div className="flex justify-between items-center gap-x-2">
        <div className="flex items-center gap-x-1">
          <div className="flex">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <BaseAvatar
                  name=""
                  key={index}
                  className={cn(
                    "w-5 border border-white h-5",
                    index > 0 && "-ml-2",
                  )}
                  src="https://yt3.ggpht.com/nOZ7FSHGscNGp4-kb87a4aF0sM0_SzLwNW2r7Au8eDP8XQliIOwB9I1Lq6mkcs6OJJmVPdHV=s88-c-k-c0x00ffffff-no-rj"
                />
              ))}
          </div>
          <span className="text-xs font-medium text-gray-500">Membros (5)</span>
        </div>
        <span className="text-xs font-medium text-gray-500">Tarefas (25)</span>
      </div>
    </button>
  );
}
