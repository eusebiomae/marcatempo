import { create } from "zustand";
import { db, uid, type TimeEntry, type Project, type Client, type Settings, getSettings } from "./db";

interface RunningTimer {
  description: string;
  projectId?: string;
  clientId?: string;
  tags: string[];
  billable: boolean;
  startTime: number;
}

interface AppState {
  entries: TimeEntry[];
  projects: Project[];
  clients: Client[];
  settings: Settings | null;
  running: RunningTimer | null;
  loaded: boolean;

  load: () => Promise<void>;
  setSettings: (patch: Partial<Settings>) => Promise<void>;

  // Timer
  startTimer: (data: Omit<RunningTimer, "startTime">) => void;
  stopTimer: () => Promise<void>;
  cancelTimer: () => void;
  updateRunning: (patch: Partial<RunningTimer>) => void;

  // Entries
  addEntry: (entry: Omit<TimeEntry, "id">) => Promise<void>;
  updateEntry: (id: string, patch: Partial<TimeEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  duplicateEntry: (id: string) => Promise<void>;

  // Projects
  addProject: (p: Omit<Project, "id" | "createdAt">) => Promise<void>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Clients
  addClient: (c: Omit<Client, "id" | "createdAt">) => Promise<void>;
  updateClient: (id: string, patch: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // Backup
  exportBackup: () => Promise<string>;
  importBackup: (json: string) => Promise<void>;
  wipeAll: () => Promise<void>;
}

const RUNNING_KEY = "marcatempo.running";

function loadRunning(): RunningTimer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RUNNING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveRunning(r: RunningTimer | null) {
  if (typeof window === "undefined") return;
  if (r) localStorage.setItem(RUNNING_KEY, JSON.stringify(r));
  else localStorage.removeItem(RUNNING_KEY);
}

export const useApp = create<AppState>((set, get) => ({
  entries: [],
  projects: [],
  clients: [],
  settings: null,
  running: null,
  loaded: false,

  async load() {
    const [entries, projects, clients, settings] = await Promise.all([
      db.entries.toArray(),
      db.projects.toArray(),
      db.clients.toArray(),
      getSettings(),
    ]);
    set({
      entries: entries.sort((a, b) => b.startTime - a.startTime),
      projects,
      clients,
      settings,
      running: loadRunning(),
      loaded: true,
    });
    applyTheme(settings.theme);
  },

  async setSettings(patch) {
    const cur = get().settings;
    if (!cur) return;
    const next = { ...cur, ...patch };
    await db.settings.put(next);
    set({ settings: next });
    if (patch.theme) applyTheme(patch.theme);
  },

  startTimer(data) {
    const running: RunningTimer = { ...data, startTime: Date.now() };
    saveRunning(running);
    set({ running });
  },

  async stopTimer() {
    const r = get().running;
    if (!r) return;
    const endTime = Date.now();
    const duration = Math.round((endTime - r.startTime) / 1000);
    const entry: TimeEntry = {
      id: uid(),
      description: r.description,
      projectId: r.projectId,
      clientId: r.clientId,
      tags: r.tags,
      startTime: r.startTime,
      endTime,
      duration,
      billable: r.billable,
    };
    await db.entries.put(entry);
    saveRunning(null);
    set({ running: null, entries: [entry, ...get().entries] });
  },

  cancelTimer() {
    saveRunning(null);
    set({ running: null });
  },

  updateRunning(patch) {
    const r = get().running;
    if (!r) return;
    const next = { ...r, ...patch };
    saveRunning(next);
    set({ running: next });
  },

  async addEntry(entry) {
    const e: TimeEntry = { ...entry, id: uid() };
    await db.entries.put(e);
    set({ entries: [e, ...get().entries].sort((a, b) => b.startTime - a.startTime) });
  },

  async updateEntry(id, patch) {
    await db.entries.update(id, patch);
    set({
      entries: get()
        .entries.map((e) => (e.id === id ? { ...e, ...patch } : e))
        .sort((a, b) => b.startTime - a.startTime),
    });
  },

  async deleteEntry(id) {
    await db.entries.delete(id);
    set({ entries: get().entries.filter((e) => e.id !== id) });
  },

  async duplicateEntry(id) {
    const e = get().entries.find((x) => x.id === id);
    if (!e) return;
    get().startTimer({
      description: e.description,
      projectId: e.projectId,
      clientId: e.clientId,
      tags: e.tags,
      billable: e.billable,
    });
  },

  async addProject(p) {
    const project: Project = { ...p, id: uid(), createdAt: Date.now() };
    await db.projects.put(project);
    set({ projects: [...get().projects, project] });
  },

  async updateProject(id, patch) {
    await db.projects.update(id, patch);
    set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  },

  async deleteProject(id) {
    await db.projects.delete(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },

  async addClient(c) {
    const client: Client = { ...c, id: uid(), createdAt: Date.now() };
    await db.clients.put(client);
    set({ clients: [...get().clients, client] });
  },

  async updateClient(id, patch) {
    await db.clients.update(id, patch);
    set({ clients: get().clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  },

  async deleteClient(id) {
    await db.clients.delete(id);
    set({ clients: get().clients.filter((c) => c.id !== id) });
  },

  async exportBackup() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      clients: await db.clients.toArray(),
      projects: await db.projects.toArray(),
      entries: await db.entries.toArray(),
      settings: await db.settings.toArray(),
    };
    return JSON.stringify(data, null, 2);
  },

  async importBackup(json) {
    const data = JSON.parse(json);
    await db.transaction("rw", db.clients, db.projects, db.entries, db.settings, async () => {
      await Promise.all([db.clients.clear(), db.projects.clear(), db.entries.clear(), db.settings.clear()]);
      if (data.clients) await db.clients.bulkPut(data.clients);
      if (data.projects) await db.projects.bulkPut(data.projects);
      if (data.entries) await db.entries.bulkPut(data.entries);
      if (data.settings) await db.settings.bulkPut(data.settings);
    });
    await get().load();
  },

  async wipeAll() {
    await db.transaction("rw", db.clients, db.projects, db.entries, db.settings, async () => {
      await Promise.all([db.clients.clear(), db.projects.clear(), db.entries.clear(), db.settings.clear()]);
    });
    saveRunning(null);
    await get().load();
  },
}));

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
