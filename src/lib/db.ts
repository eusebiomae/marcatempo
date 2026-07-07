import Dexie, { type Table } from "dexie";

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  clientId?: string;
  active: boolean;
  hourlyRate: number;
  description?: string;
  createdAt: number;
}

export interface TimeEntry {
  id: string;
  description: string;
  projectId?: string;
  clientId?: string;
  tags: string[];
  startTime: number; // ms epoch
  endTime?: number;
  duration: number; // seconds
  billable: boolean;
}

export interface Settings {
  id: "app";
  theme: "light" | "dark";
  currency: string;
  hourFormat: "12h" | "24h";
  firstDayOfWeek: 0 | 1; // 0=Sun, 1=Mon
  dailyGoalHours: number;
  weeklyGoalHours: number;
}

class MarcatempoDB extends Dexie {
  clients!: Table<Client, string>;
  projects!: Table<Project, string>;
  entries!: Table<TimeEntry, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("marcatempo");
    this.version(1).stores({
      clients: "id, name, createdAt",
      projects: "id, name, clientId, active, createdAt",
      entries: "id, projectId, clientId, startTime, endTime",
      settings: "id",
    });
  }
}

export const db = new MarcatempoDB();

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export async function getSettings(): Promise<Settings> {
  const existing = await db.settings.get("app");
  if (existing) return existing;
  const defaults: Settings = {
    id: "app",
    theme: "dark",
    currency: "BRL",
    hourFormat: "24h",
    firstDayOfWeek: 1,
    dailyGoalHours: 8,
    weeklyGoalHours: 40,
  };
  await db.settings.put(defaults);
  return defaults;
}

// ===========================================
// TIME ENTRIES
// ===========================================

export async function addEntry(entry: TimeEntry) {
  return db.entries.add(entry);
}

export async function getEntries() {
  return db.entries.orderBy("startTime").reverse().toArray();
}

export async function updateEntry(id: string, patch: Partial<TimeEntry>) {
  return db.entries.update(id, patch);
}

export async function deleteEntry(id: string) {
  return db.entries.delete(id);
}

// ===========================================
// PROJECTS
// ===========================================

export async function addProject(project: Project) {
  return db.projects.add(project);
}

export async function updateProject(
  id: string,
  patch: Partial<Project>,
) {
  return db.projects.update(id, patch);
}

export async function deleteProject(id: string) {
  return db.projects.delete(id);
}

export async function getProjects() {
  return db.projects
    .orderBy("name")
    .toArray();
}

// ===========================================
// CLIENTS
// ===========================================

export async function addClient(client: Client) {
  return db.clients.add(client);
}

export async function getClients() {
  return db.clients.orderBy("name").toArray();
}

export async function updateClient(
  id: string,
  patch: Partial<Client>,
) {
  return db.clients.update(id, patch);
}

export async function deleteClient(id: string) {
  return db.clients.delete(id);
}