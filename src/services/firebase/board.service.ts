import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { Board } from "@/types/organization.types";

export const boardService = {
  async createBoard(title: string, workspaceId: string): Promise<Board> {
    const ref = await addDoc(collection(db, "boards"), {
      title,
      workspaceId,
      createdAt: serverTimestamp(),
    });

    // Busca o documento criado para ter o Timestamp real do Firestore
    const snap = await getDoc(doc(db, "boards", ref.id));
    return { id: snap.id, ...snap.data() } as Board;
  },

  async listBoards(workspaceId: string): Promise<Board[]> {
    const q = query(
      collection(db, "boards"),
      where("workspaceId", "==", workspaceId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Board));
  },

  async getBoardById(boardId: string): Promise<Board | null> {
    const snap = await getDoc(doc(db, "boards", boardId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Board;
  },

  async deleteBoard(boardId: string): Promise<void> {
    await deleteDoc(doc(db, "boards", boardId));
  },
};