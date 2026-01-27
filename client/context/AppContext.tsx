import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_AUTH = "makerburg_auth_v1";
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

interface AppContextType {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
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
  const [loggedIn, setLoggedInState] = useState(false);
  const [saved, setSaved] = useState<SavedState>({ items: [] });
  const [authReady, setAuthReady] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSaveItem, setPendingSaveItem] = useState<SavedItem | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const auth = await AsyncStorage.getItem(KEY_AUTH);
        setLoggedInState(auth === "1");
        const raw = await AsyncStorage.getItem(KEY_SAVED);
        if (raw) setSaved(JSON.parse(raw));
      } catch (e) {
        console.error("Error loading app state:", e);
      }
      setAuthReady(true);
    })();
  }, []);

  const setLoggedIn = useCallback(async (value: boolean) => {
    setLoggedInState(value);
    try {
      await AsyncStorage.setItem(KEY_AUTH, value ? "1" : "0");
    } catch (e) {
      console.error("Error saving auth state:", e);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    AsyncStorage.setItem(KEY_SAVED, JSON.stringify(saved)).catch((e) =>
      console.error("Error saving saved items:", e)
    );
  }, [saved, authReady]);

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
        loggedIn,
        setLoggedIn,
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
