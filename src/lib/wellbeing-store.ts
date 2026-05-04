import { useEffect, useState, useCallback } from "react";

export type AppId = "instagram" | "youtube" | "whatsapp" | "chrome";

export interface AppState {
  id: AppId;
  name: string;
  icon: string;
  color: string;
  usage: number; // seconds
  limit: number; // seconds
  blocked: boolean;
}

export interface StoreState {
  apps: Record<AppId, AppState>;
  activeAppId: AppId | null;
  lastTick: number | null;
}

const STORAGE_KEY = "digital-wellbeing-v1";

const defaults: StoreState = {
  apps: {
    instagram: { id: "instagram", name: "Instagram", icon: "📷", color: "from-pink-500 to-orange-400", usage: 0, limit: 30 * 60, blocked: false },
    youtube:   { id: "youtube",   name: "YouTube",   icon: "▶️", color: "from-red-500 to-red-600",   usage: 0, limit: 45 * 60, blocked: false },
    whatsapp:  { id: "whatsapp",  name: "WhatsApp",  icon: "💬", color: "from-green-500 to-emerald-500", usage: 0, limit: 20 * 60, blocked: false },
    chrome:    { id: "chrome",    name: "Chrome",    icon: "🌐", color: "from-blue-500 to-cyan-500", usage: 0, limit: 60 * 60, blocked: false },
  },
  activeAppId: null,
  lastTick: null,
};

function load(): StoreState {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed, apps: { ...defaults.apps, ...parsed.apps } };
  } catch { return defaults; }
}

function save(s: StoreState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

const listeners = new Set<(s: StoreState) => void>();
let state: StoreState | null = null;

function getState(): StoreState {
  if (!state) state = load();
  return state;
}
function setState(updater: (s: StoreState) => StoreState) {
  state = updater(getState());
  save(state);
  listeners.forEach((l) => l(state!));
}

export function useWellbeing() {
  const [s, setS] = useState<StoreState>(() => getState());
  useEffect(() => {
    const l = (ns: StoreState) => setS(ns);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  // Global timer — ticks active app
  useEffect(() => {
    const interval = setInterval(() => {
      const cur = getState();
      if (!cur.activeAppId) return;
      const app = cur.apps[cur.activeAppId];
      if (app.blocked) return;
      const newUsage = app.usage + 1;
      const blocked = newUsage >= app.limit;
      setState((st) => ({
        ...st,
        apps: { ...st.apps, [app.id]: { ...app, usage: newUsage, blocked } },
        activeAppId: blocked ? null : st.activeAppId,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startApp = useCallback((id: AppId) => {
    setState((st) => {
      if (st.apps[id].blocked) return st;
      return { ...st, activeAppId: id };
    });
  }, []);
  const stopApp = useCallback(() => {
    setState((st) => ({ ...st, activeAppId: null }));
  }, []);
  const setLimit = useCallback((id: AppId, minutes: number) => {
    setState((st) => {
      const app = st.apps[id];
      const limit = Math.max(60, Math.round(minutes * 60));
      return { ...st, apps: { ...st.apps, [id]: { ...app, limit, blocked: app.usage >= limit } } };
    });
  }, []);
  const grantOverride = useCallback((id: AppId) => {
    setState((st) => {
      const app = st.apps[id];
      return { ...st, apps: { ...st.apps, [id]: { ...app, limit: app.limit + 10 * 60, blocked: false } } };
    });
  }, []);
  const resetDay = useCallback(() => {
    setState((st) => {
      const apps = { ...st.apps };
      (Object.keys(apps) as AppId[]).forEach((k) => {
        apps[k] = { ...apps[k], usage: 0, blocked: false };
      });
      return { ...st, apps, activeAppId: null };
    });
  }, []);

  return { state: s, startApp, stopApp, setLimit, grantOverride, resetDay };
}

export const PARENT_PIN = "1234";

export function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
