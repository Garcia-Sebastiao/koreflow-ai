import { Logo } from "@/assets/common/logo";

export function Loading() {
  return (
    <div className="w-full flex items-center justify-center h-dvh">
      <div className="flex items-center scale-79 animate-bounce gap-x-1">
        <span className="text-5xl font-bold text-primary">K</span>
        <div className="animate-spin duration-300">
          <Logo />
        </div>
        <span className="text-5xl font-bold text-primary">REFLOW</span>
      </div>
    </div>
  );
}
