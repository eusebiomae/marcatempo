import { create } from "zustand";

import {
  addEntry,
  deleteEntry as deleteEntryDB,
  getEntries,
  getProjects,
  getClients,
  uid,
  type TimeEntry,
  type Project,
  type Client,
  addProject,
  updateProject as updateProjectDB,
  deleteProject as deleteProjectDB,
} from "./db";

export interface RunningTimer {
  description: string;
  projectId?: string;
  clientId?: string;
  tags: string[];
  billable: boolean;
  startTime: number;
}

interface AppStore {
  running: RunningTimer | null;

  entries: TimeEntry[];
  projects: Project[];
  clients: Client[];

  startTimer: (timer: Omit<RunningTimer, "startTime">) => void;

  stopTimer: () => Promise<void>;

  updateRunning: (patch: Partial<RunningTimer>) => void;

  loadEntries: () => Promise<void>;

  loadProjects: () => Promise<void>;

  createProject: (project: Project) => Promise<void>;

  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;

  deleteProject: (id: string) => Promise<void>;

  loadClients: () => Promise<void>;

  initialize: () => Promise<void>;

  deleteEntry: (id: string) => Promise<void>;
}

export const useApp = create<AppStore>((set) => ({
  running: null,

  entries: [],

  projects: [],

  clients: [],

  startTimer(timer) {
    set({
      running: {
        ...timer,
        startTime: Date.now(),
      },
    });
  },

  async stopTimer() {
    const running = useApp.getState().running;

    if (!running) return;

    const duration = Math.floor((Date.now() - running.startTime) / 1000);

    const entry: TimeEntry = {
      id: uid(),

      description: running.description,

      projectId: running.projectId,

      clientId: running.clientId,

      tags: running.tags,

      billable: running.billable,

      startTime: running.startTime,

      endTime: Date.now(),

      duration,
    };

    await addEntry(entry);

    const entries = await getEntries();

    set({
      running: null,
      entries,
    });
  },

  updateRunning(patch) {
    set((state) => ({
      running: state.running
        ? {
            ...state.running,
            ...patch,
          }
        : null,
    }));
  },

  async loadEntries() {
    const entries = await getEntries();

    set({
      entries,
    });
  },

  async loadProjects() {
    const projects = await getProjects();

    set({
      projects,
    });
  },

  async loadClients() {
    const clients = await getClients();

    set({
      clients,
    });
  },

  async initialize() {
    await Promise.all([
      useApp.getState().loadEntries(),
      useApp.getState().loadProjects(),
      useApp.getState().loadClients(),
    ]);
  },

  async deleteEntry(id) {
    await deleteEntryDB(id);

    const entries = await getEntries();

    set({
      entries,
    });
  },

  async createProject(project) {
    await addProject(project);

    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  async updateProject(id, patch) {
    await updateProjectDB(id, patch);

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,

              ...patch,
            }
          : project,
      ),
    }));
  },

  async deleteProject(id) {
    await deleteProjectDB(id);

    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    }));
  },
}));
