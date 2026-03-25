export type TaskStatus =
  | "todo"
  | "doing"
  | "to_test"
  | "testing"
  | "done";

export const BOARD_COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo",    label: "Por Fazer"   },
  { id: "doing",   label: "A Fazer"     },
  { id: "to_test", label: "Por Testar"  },
  { id: "testing", label: "A Testar"    },
  { id: "done",    label: "Concluídas"  },
];