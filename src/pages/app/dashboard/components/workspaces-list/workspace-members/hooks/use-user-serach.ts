import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/firebase/user.service";
import type { SelectItem } from "@/components/shared/input/base-select-input/base-select-input";

export function useUserSearch(excludeIds: string[] = []) {
  const { user } = useAuthStore();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SelectItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!term.trim() || !user) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const users = await userService.getUsers(term, user.uid);
        setResults(
          users
            .filter((u) => !excludeIds.includes(u.uid))
            .map((u) => ({
              id: u.uid,
              name: u.name,
              email: u.email,
              avatar: u.avatar,
            })),
        );
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, user, excludeIds.join(",")]);

  return { term, setTerm: (t: string) => setTerm(t), results, isSearching };
}
