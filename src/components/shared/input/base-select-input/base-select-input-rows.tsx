import { cn } from "@/lib/utils";
import type { SelectItem } from "./base-select-input";
import { BaseAvatar } from "../../base-avatar/base-avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";

interface SelectRowProps {
  item: SelectItem;
  isSelected: boolean;
  onSelect: () => void;
  mode: "single" | "multiple";
}

export function SelectRow({
  item,
  isSelected,
  onSelect,
}: SelectRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors",
        isSelected && "bg-primary/5",
      )}
    >
      <div className="flex items-center gap-x-3">
        <BaseAvatar src={item.avatar} name={item.name} className="w-8 h-8" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{item.name}</span>
          {item.email && (
            <span className="text-xs text-gray-400">{item.email}</span>
          )}
        </div>
      </div>

      <Button
        type="button"
        onClick={onSelect}
        className={cn(
          "h-8 w-8 p-0 transition-colors",
          isSelected
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "bg-primary/10 text-primary hover:bg-primary/20",
        )}
      >
        {isSelected ? (
          <XIcon className="w-4 h-4" />
        ) : (
          <PlusIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
