import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "leader" | "dev" | "qa";

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  image?: string;
}

export interface Member {
  id: string; 
  userId: string;
  workspaceId: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  title?: string; 
}

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: Timestamp | Date;
}
