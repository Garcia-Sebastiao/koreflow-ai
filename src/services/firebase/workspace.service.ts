import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { Member, Workspace } from "@/types/organization.types";

export const workspaceService = {
  // ─── Criar Workspace ───────────────────────────────────────────────
  async createWorkspace(
    name: string,
    ownerId: string,
    ownerData: Pick<Member, "name" | "email" | "avatar">
  ): Promise<Workspace> {
    const workspaceRef = await addDoc(collection(db, "workspaces"), {
      name,
      ownerId,
      createdAt: serverTimestamp(),
    });

    // Cria o membro owner com role "admin" usando ID composto
    const memberId = `${ownerId}_${workspaceRef.id}`;
    const memberRef = doc(db, "members", memberId);

    await writeBatch(db)
      .set(memberRef, {
        userId: ownerId,
        workspaceId: workspaceRef.id,
        role: "admin",
        name: ownerData.name,
        email: ownerData.email,
        avatar: ownerData.avatar ?? "",
      } satisfies Omit<Member, "id">)
      .commit();

    return {
      id: workspaceRef.id,
      name,
      ownerId,
      createdAt: new Date(),
    };
  },

  // ─── Listar Workspaces do utilizador ───────────────────────────────
  async listWorkspacesByUser(userId: string): Promise<Workspace[]> {
    // 1. Busca todos os memberships do utilizador
    const membersQuery = query(
      collection(db, "members"),
      where("userId", "==", userId)
    );
    const membersSnap = await getDocs(membersQuery);

    if (membersSnap.empty) return [];

    // 2. Busca cada workspace em paralelo
    const workspaceIds = membersSnap.docs.map((d) => d.data().workspaceId);

    const workspacePromises = workspaceIds.map((id) =>
      getDoc(doc(db, "workspaces", id))
    );
    const workspaceDocs = await Promise.all(workspacePromises);

    return workspaceDocs
      .filter((d) => d.exists())
      .map((d) => ({ id: d.id, ...d.data() } as Workspace));
  },

  // ─── Buscar um Workspace por ID ────────────────────────────────────
  async getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
    const workspaceDoc = await getDoc(doc(db, "workspaces", workspaceId));

    if (!workspaceDoc.exists()) return null;

    return { id: workspaceDoc.id, ...workspaceDoc.data() } as Workspace;
  },

  // ─── Deletar Workspace ─────────────────────────────────────────────
  // Apenas o owner (admin) pode deletar.
  // Deleta o workspace + todos os membros associados.
  async deleteWorkspace(
    workspaceId: string,
    requesterId: string
  ): Promise<void> {
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const workspaceDoc = await getDoc(workspaceRef);

    if (!workspaceDoc.exists()) {
      throw new Error("Workspace não encontrado.");
    }

    const workspace = workspaceDoc.data() as Workspace;

    if (workspace.ownerId !== requesterId) {
      throw new Error("Apenas o proprietário pode eliminar este workspace.");
    }

    // Busca todos os membros do workspace para deletar em batch
    const membersQuery = query(
      collection(db, "members"),
      where("workspaceId", "==", workspaceId)
    );
    const membersSnap = await getDocs(membersQuery);

    const batch = writeBatch(db);

    membersSnap.docs.forEach((memberDoc) => batch.delete(memberDoc.ref));
    batch.delete(workspaceRef);

    await batch.commit();
  },

  // ─── Remover um Membro do Workspace ───────────────────────────────
  async removeMember(userId: string, workspaceId: string): Promise<void> {
    const memberId = `${userId}_${workspaceId}`;
    await deleteDoc(doc(db, "members", memberId));
  },
};