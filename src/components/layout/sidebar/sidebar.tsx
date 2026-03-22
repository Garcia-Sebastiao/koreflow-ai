import { Logo } from "@/assets/common/logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListTodoIcon,
  LogOutIcon,
  MoonIcon,
} from "lucide-react";
import { Link } from "react-router";

export function Sidebar() {
  const pathname = window.location.pathname;
  return (
    <div className="flex w-17 py-4 border-r-2 border-r-border/50 h-full flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-y-16">
        <Logo />

        <nav className="flex flex-col items-center w-full gap-y-4">
          <Link
            className={cn(
              "w-12 h-12 flex rounded-sm items-center transition-all justify-center",
              pathname?.includes("dashboard") && "bg-primary/10",
            )}
            to="/app/dashboard"
          >
            <LayoutDashboard
              className={cn(
                "size-6 text-gray-500 hover:text-primary transition-all",
                pathname?.includes("dashboard") && "text-primary!",
              )}
            />
          </Link>

          <Link
            className={cn(
              "w-12 h-12 flex rounded-sm items-center transition-all justify-center",
              pathname?.includes("projects") && "bg-primary/10",
            )}
            to="/app/projects"
          >
            <ListTodoIcon
              className={cn(
                "size-6 text-gray-500 hover:text-primary transition-all",
                pathname?.includes("projects") && "text-primary!",
              )}
            />
          </Link>
        </nav>
      </div>

      <div className="flex flex-col items-center w-full gap-y-6">
        <MoonIcon className="size-6 text-gray-500" />
        <LogOutIcon className="size-6 text-gray-500" />
      </div>
    </div>
  );
}
