/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import type { User } from "@/types/user.types";

export const userService = {
  async syncUserProfile(firebaseUser: any): Promise<User> {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const newUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "Novo Utilizador",
        email: firebaseUser.email || "",
        avatar: firebaseUser.photoURL || "",
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newUser);
      return newUser as unknown as User;
    }

    return userDoc.data() as User;
  },

  async getUsers(term: string, excludeId: string): Promise<User[]> {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed) return [];

    const snap = await getDocs(collection(db, "users"));
    return snap.docs
      .map((d) => d.data() as User)
      .filter(
        (u) =>
          u.uid !== excludeId &&
          (u.name.toLowerCase().includes(trimmed) ||
            u.email.toLowerCase().includes(trimmed)),
      );
  },
};
