import { XIcon } from "lucide-react";
import { BaseAvatar } from "../../base-avatar/base-avatar";
import type { SelectItem } from "./base-select-input";

interface SelectedBadgeProps {
  item: SelectItem;
  onRemove: () => void;
}

export function SelectedBadge({ item, onRemove }: SelectedBadgeProps) {
  return (
    <div className="flex items-center gap-x-2 bg-gray-100 rounded-full pl-1 pr-2 py-1">
      <BaseAvatar src={item.avatar} name={item.name} className="w-5 h-5" />
      <span className="text-xs font-medium text-gray-700">{item.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <XIcon className="w-3 h-3" />
      </button>
    </div>
  );
}
