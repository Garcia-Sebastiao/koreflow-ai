import { Progress } from "@/components/ui/progress";

export function WorkspaceProgress() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-12 flex-none h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">🔥</span>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-gray-700">Fronted Team</h4>
          <span className="text-gray-400 text-xs">68% complete</span>
        </div>
        <Progress value={68} className="min-w-xs bg-gray-200" />
      </div>
    </div>
  );
}
