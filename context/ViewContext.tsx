"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ViewMode = "mobile" | "desktop";

interface ViewContextType {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  toggle: () => void;
  /** True when the actual screen is small (<768px). When true, the layout is forced to mobile. */
  isNarrow: boolean;
  /** The effective layout to render — collapses to "mobile" on narrow screens. */
  effective: ViewMode;
}

const ViewContext = createContext<ViewContextType | null>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setViewState] = useState<ViewMode>("mobile");
  const [isNarrow, setIsNarrow] = useState(false);

  // Read persisted preference once on mount.
  useEffect(() => {
    const stored = localStorage.getItem("bydes_view");
    if (stored === "mobile" || stored === "desktop") setViewState(stored);
  }, []);

  // Track actual viewport width — never let toggle escape true mobile.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setView = (next: ViewMode) => {
    setViewState(next);
    try {
      localStorage.setItem("bydes_view", next);
    } catch {
      /* ignore quota / private mode errors */
    }
  };

  const toggle = () => setView(view === "mobile" ? "desktop" : "mobile");

  const effective: ViewMode = isNarrow ? "mobile" : view;

  return (
    <ViewContext.Provider value={{ view, setView, toggle, isNarrow, effective }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("useView must be used within ViewProvider");
  return ctx;
}
