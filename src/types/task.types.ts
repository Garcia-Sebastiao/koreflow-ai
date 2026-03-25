import type { TaskStatus } from "./board.types";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskAssignee {
  userId: string;
  name: string;
  avatar?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: "comment" | "rejection"; // rejection = reprovação do QA
  createdAt: string;
}

export interface TaskStatusEvent {
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  byUserId: string;
  byUserName: string;
  occurredAt: string;
}

export interface Task {
  id: string;
  boardId: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TaskAssignee;
  dueDate?: string;
  createdAt: string;
  createdBy: string;

  startedAt?: string;      // quando movido para "doing"
  deliveredAt?: string;    // quando movido para "to_test"
  testedAt?: string;       // quando movido para "testing"
  completedAt?: string;    // quando movido para "done"
  statusHistory: TaskStatusEvent[];
}