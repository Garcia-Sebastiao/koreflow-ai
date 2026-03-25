import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { Task, TaskComment, TaskStatusEvent } from "@/types/task.types";
import type { TaskStatus } from "@/types/board.types";

export const taskService = {
  async createTask(data: Omit<Task, "id" | "statusHistory">): Promise<Task> {
    const ref = await addDoc(collection(db, "tasks"), {
      ...data,
      statusHistory: [],
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, ...data, statusHistory: [] };
  },
  async listTasks(boardId: string, workspaceId: string): Promise<Task[]> {
    const q = query(
      collection(db, "tasks"),
      where("boardId", "==", boardId),
      where("workspaceId", "==", workspaceId),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Task);
  },
  async getTaskById(taskId: string): Promise<Task | null> {
    const snap = await getDoc(doc(db, "tasks", taskId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Task;
  },
  async moveTask(
    task: Task,
    newStatus: TaskStatus,
    movedBy: { userId: string; userName: string },
  ): Promise<Partial<Task>> {
    const now = new Date().toISOString();

    const event: TaskStatusEvent = {
      fromStatus: task.status,
      toStatus: newStatus,
      byUserId: movedBy.userId,
      byUserName: movedBy.userName,
      occurredAt: now,
    };

    const updates: Partial<Task> = {
      status: newStatus,
      statusHistory: [...(task.statusHistory ?? []), event],
    };

    if (newStatus === "doing" && !task.startedAt) {
      updates.startedAt = now;
    }
    if (newStatus === "to_test" && !task.deliveredAt) {
      updates.deliveredAt = now;
    }
    if (newStatus === "testing" && !task.testedAt) {
      updates.testedAt = now;
    }
    if (newStatus === "done") {
      updates.completedAt = now;
    }

    await updateDoc(doc(db, "tasks", task.id), updates);
    return updates;
  },
  async deleteTask(taskId: string): Promise<void> {
    await deleteDoc(doc(db, "tasks", taskId));
  },

  async addComment(
    taskId: string,
    comment: Omit<TaskComment, "id" | "createdAt">,
  ): Promise<TaskComment> {
    const ref = await addDoc(collection(db, "tasks", taskId, "comments"), {
      ...comment,
      createdAt: serverTimestamp(),
    });
    return {
      id: ref.id,
      ...comment,
      createdAt: new Date().toISOString(),
    };
  },

  async listComments(taskId: string): Promise<TaskComment[]> {
    const snap = await getDocs(collection(db, "tasks", taskId, "comments"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as TaskComment)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async updateAssignee(
    taskId: string,
    assignee?: { userId: string; name: string; avatar?: string },
  ): Promise<void> {
    await updateDoc(doc(db, "tasks", taskId), {
      assignee: assignee ?? null,
    });
  },
};
