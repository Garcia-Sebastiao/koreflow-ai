import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";

interface BaseAvatarProps {
  src?: string;
  name: string;
  className?: string;
}

export function BaseAvatar({ src, name, className }: BaseAvatarProps) {
  const initials = getInitials(name);

  return (
    <Avatar className={cn("size-10 flex-none! min-w-10 min-h-10 bg-primary", className)}>
      <AvatarImage 
        src={src} 
        alt={name} 
        className="object-cover" 
      />
      <AvatarFallback className="bg-secondary-shade-100/10 font-medium  text-xs pointer-events-none! text-white select-none!">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}