import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

export function BaseDropdown({
  children,
  trigger,
  className,
}: {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          <div className="cursor-pointer hover:opacity-80">{trigger}</div>
        ) : (
          <MoreVerticalIcon className="size-5 cursor-pointer text-gray-500" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          "w-50 bg-white z-100! mt-1 border border-border shadow-xs rounded-lg p-2",
          className,
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
