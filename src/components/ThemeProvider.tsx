"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeSnapshot {
  theme: Theme;
  resolved: "light" | "dark";
}

const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

// Cached snapshot objects — only replaced when values change
const SERVER_SNAPSHOT: ThemeSnapshot = { theme: "system", resolved: "light" };
let cachedSnapshot: ThemeSnapshot = { theme: "system", resolved: "light" };

const listeners = new Set<() => void>();

function initStore() {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("theme");
  let theme: Theme = "system";
  if (saved === "light" || saved === "dark" || saved === "system") {
    theme = saved;
  }
  cachedSnapshot = { theme, resolved: resolveTheme(theme) };
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ThemeSnapshot {
  return cachedSnapshot;
}

function getServerSnapshot(): ThemeSnapshot {
  return SERVER_SNAPSHOT;
}

function setStoreTheme(newTheme: Theme) {
  const resolved = resolveTheme(newTheme);
  cachedSnapshot = { theme: newTheme, resolved };
  localStorage.setItem("theme", newTheme);
  applyTheme(resolved);
  emit();
}

// Initialize at module load (client only)
initStore();

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((newTheme: Theme) => {
    setStoreTheme(newTheme);
  }, []);

  // Apply theme on mount and listen for system preference changes
  useEffect(() => {
    applyTheme(cachedSnapshot.resolved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (cachedSnapshot.theme === "system") {
        const resolved = getSystemTheme();
        cachedSnapshot = { theme: "system", resolved };
        applyTheme(resolved);
        emit();
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: snapshot.theme,
        resolvedTheme: snapshot.resolved,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
