import { DndContext } from "@dnd-kit/core";

export function WorkspaceBoard() {
  return (
    <DndContext>
      <div className="w-full flex-1 bg-gray-100"></div>;
    </DndContext>
  );
}
