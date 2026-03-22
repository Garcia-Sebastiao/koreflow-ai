import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { Member, UserRole } from "@/types/organization.types";
import type { User } from "@/types/user.types";

export const memberService = {
  async listMembers(workspaceId: string): Promise<Member[]> {
    const q = query(
      collection(db, "members"),
      where("workspaceId", "==", workspaceId),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Member);
  },

  async searchUsers(term: string): Promise<User[]> {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed) return [];
    const snap = await getDocs(collection(db, "users"));
    return snap.docs
      .map((d) => d.data() as User)
      .filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.email.toLowerCase().includes(trimmed),
      );
  },

  // title adicionado como parâmetro opcional
  async addMember(
    user: User,
    workspaceId: string,
    role: UserRole = "dev",
    title?: string,
  ): Promise<Member> {
    const memberId = `${user.uid}_${workspaceId}`;
    const memberRef = doc(db, "members", memberId);

    const member: Omit<Member, "id"> = {
      userId: user.uid,
      workspaceId,
      role,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? "",
      ...(title?.trim() && { title: title.trim() }),
    };

    await setDoc(memberRef, member);
    return { id: memberId, ...member };
  },

  async removeMember(userId: string, workspaceId: string): Promise<void> {
    await deleteDoc(doc(db, "members", `${userId}_${workspaceId}`));
  },

  async updateRole(
    userId: string,
    workspaceId: string,
    role: UserRole,
  ): Promise<void> {
    await updateDoc(doc(db, "members", `${userId}_${workspaceId}`), { role });
  },
};
