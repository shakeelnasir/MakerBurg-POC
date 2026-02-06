import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest, getApiUrl } from "@/lib/query-client";

const KEY_SAVED = "makerburg_saved_v1";

export type SavedItem =
  | { kind: "story"; id: string }
  | { kind: "opportunity"; id: string }
  | { kind: "video"; id: string }
  | { kind: "culture"; id: string };

type SavedState = {
  items: SavedItem[];
};

function uniqSaved(items: SavedItem[]) {
  const seen = new Set<string>();
  return items.filter((it) => {
    const k = `${it.kind}:${it.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export type AuthUser = {
  id: string;
  email: string;
};

interface AppContextType {
  user: AuthUser | null;
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  saved: SavedState;
  toggleSave: (item: SavedItem) => void;
  isSaved: (item: SavedItem) => boolean;
  authReady: boolean;
  showLoginModal: boolean;
  setShowLoginModal: (value: boolean) => void;
  pendingSaveItem: SavedItem | null;
  setPendingSaveItem: (item: SavedItem | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [saved, setSaved] = useState<SavedState>({ items: [] });
  const [authReady, setAuthReady] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSaveItem, setPendingSaveItem] = useState<SavedItem | null>(null);

  const loggedIn = user !== null;

  useEffect(() => {
    (async () => {
      try {
        const baseUrl = getApiUrl();
        const res = await fetch(new URL("/api/auth/me", baseUrl), {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
        const raw = await AsyncStorage.getItem(KEY_SAVED);
        if (raw) setSaved(JSON.parse(raw));
      } catch (e) {
        console.error("Error loading app state:", e);
      }
      setAuthReady(true);
    })();
  }, []);

  const setLoggedIn = useCallback(async (value: boolean) => {
    if (!value) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    AsyncStorage.setItem(KEY_SAVED, JSON.stringify(saved)).catch((e) =>
      console.error("Error saving saved items:", e)
    );
  }, [saved, authReady]);

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await res.json();
      setUser(data);
      return { ok: true };
    } catch (e: any) {
      const msg = e.message || "Login failed";
      const errorText = msg.includes(":") ? msg.split(":").slice(1).join(":").trim() : msg;
      try {
        const parsed = JSON.parse(errorText);
        return { ok: false, error: parsed.error || errorText };
      } catch {
        return { ok: false, error: errorText };
      }
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await apiRequest("POST", "/api/auth/register", { email, password });
      const data = await res.json();
      setUser(data);
      return { ok: true };
    } catch (e: any) {
      const msg = e.message || "Registration failed";
      const errorText = msg.includes(":") ? msg.split(":").slice(1).join(":").trim() : msg;
      try {
        const parsed = JSON.parse(errorText);
        return { ok: false, error: parsed.error || errorText };
      } catch {
        return { ok: false, error: errorText };
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (e) {
      console.error("Logout error:", e);
    }
    setUser(null);
  }, []);

  const toggleSave = useCallback((item: SavedItem) => {
    const key = `${item.kind}:${item.id}`;
    setSaved((prev) => {
      const has = prev.items.some((x) => `${x.kind}:${x.id}` === key);
      return {
        items: has
          ? prev.items.filter((x) => `${x.kind}:${x.id}` !== key)
          : uniqSaved([item, ...prev.items]),
      };
    });
  }, []);

  const isSaved = useCallback(
    (item: SavedItem) => saved.items.some((x) => x.kind === item.kind && x.id === item.id),
    [saved.items]
  );

  return (
    <AppContext.Provider
      value={{
        user,
        loggedIn,
        setLoggedIn,
        setUser,
        login,
        register,
        logout,
        saved,
        toggleSave,
        isSaved,
        authReady,
        showLoginModal,
        setShowLoginModal,
        pendingSaveItem,
        setPendingSaveItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
