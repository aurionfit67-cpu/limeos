export type Status = "not-started" | "planning" | "active" | "paused" | "completed" | "archived";
export type TaskStatus = "inbox" | "planned" | "in-progress" | "completed" | "cancelled";
export type LifeArea = { id: string; name: string; color: string; description: string };
export type Goal = { id: string; title: string; description: string; why: string; areaId: string; deadline: string; priority: "high" | "medium" | "low"; status: Status; progress?: number; progressNote?: string; updatedAt?: string };
export type Project = { id: string; name: string; description: string; areaId: string; goalId?: string; deadline: string; status: Status; progress?: number; progressNote?: string; updatedAt?: string };
export type Milestone = { id: string; name: string; projectId: string; dueDate: string; status: Status };
export type Task = { id: string; title: string; description?: string; dueDate: string; priority: "high" | "medium" | "low"; status: TaskStatus; projectId?: string; milestoneId?: string; areaId?: string; estimatedMinutes: number; tags: string[] };
export type Habit = { id: string; name: string; frequency: string; areaId: string; goalId?: string; currentStreak: number; completedDates: string[] };
export type JournalEntry = { id: string; title: string; body: string; date: string; mood?: string; areaId?: string; favorite?: boolean };
export type TimelineEvent = { id: string; title: string; description: string; date: string; category: "milestone" | "task" | "journal" | "project" | "goal" | "decision" | "memory" };
export type Decision = { id: string; title: string; date: string; context: string; chosenOption: string; reviewDate: string };
export type Challenge = { id: string; title: string; description: string; duration: number; currentDay: number; color: string };
export type FocusSession = { id: string; taskId: string; minutes: number; completedAt: string };
export type LifeState = { profile: { name: string; role: string; initials: string }; vision: string; direction: string; values: string[]; areas: LifeArea[]; goals: Goal[]; projects: Project[]; milestones: Milestone[]; tasks: Task[]; habits: Habit[]; journal: JournalEntry[]; timeline: TimelineEvent[]; decisions: Decision[]; challenges: Challenge[]; focusSessions: FocusSession[]; captures: string[]; archivedIds: string[]; reviews: { weekly: string; monthly: string } };

export const today = new Date().toISOString().slice(0, 10);
export const storageKey = "life-os-state-v2";
export const palette = { burgundy: "#800020", cream: "#f3e6d5", paper: "#fff9f2", rose: "#d45060" } as const;

export const initialLifeState: LifeState = {
  profile: { name: "", role: "", initials: "" }, vision: "", direction: "", values: [],
  areas: [], goals: [], projects: [], milestones: [], tasks: [], habits: [], journal: [], timeline: [], decisions: [], challenges: [], focusSessions: [], captures: [], archivedIds: [], reviews: { weekly: "", monthly: "" },
};

export function seedState() { return JSON.parse(JSON.stringify(initialLifeState)) as LifeState; }
export function makeId(prefix: string) { return `${prefix}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10)}`; }
export function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`)); }
export function formatLongDate(value: string) { return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
export function calculateStreak(dates: string[], reference = today) { const set = new Set(dates); let cursor = new Date(`${reference}T12:00:00`); let count = 0; while (set.has(cursor.toISOString().slice(0, 10))) { count++; cursor.setDate(cursor.getDate() - 1); } return count; }
export function progressForProject(state: LifeState, projectId: string) { const project = state.projects.find((item) => item.id === projectId); if (typeof project?.progress === "number") return Math.max(0, Math.min(100, project.progress)); const tasks = state.tasks.filter((task) => task.projectId === projectId); if (tasks.length) return Math.round((tasks.filter((task) => task.status === "completed").length / tasks.length) * 100); const related = state.milestones.filter((m) => m.projectId === projectId); return related.length ? Math.round((related.filter((m) => m.status === "completed").length / related.length) * 100) : 0; }
export function progressForGoal(state: LifeState, goalId: string) { const goal = state.goals.find((item) => item.id === goalId); if (typeof goal?.progress === "number") return Math.max(0, Math.min(100, goal.progress)); const projects = state.projects.filter((p) => p.goalId === goalId); return projects.length ? Math.round(projects.reduce((sum, p) => sum + progressForProject(state, p.id), 0) / projects.length) : 0; }
export function calculateProgress(state: LifeState) { const active = state.tasks.filter((t) => t.status !== "cancelled"); const todayTasks = active.filter((t) => t.dueDate === today); const done = todayTasks.filter((t) => t.status === "completed").length; return { todayCount: todayTasks.length, todayCompleted: done, missionCompletion: todayTasks.length ? Math.round((done / todayTasks.length) * 100) : 0, taskCompletion: active.length ? Math.round((active.filter((t) => t.status === "completed").length / active.length) * 100) : 0, activeGoals: state.goals.filter((g) => g.status === "active").length, activeProjects: state.projects.filter((p) => !["completed", "archived"].includes(p.status)).length, completedMilestones: state.milestones.filter((m) => m.status === "completed").length }; }
export function loadState(): LifeState { if (typeof window === "undefined") return seedState(); try { const raw = window.localStorage.getItem(storageKey); return raw ? { ...seedState(), ...JSON.parse(raw) } : seedState(); } catch { return seedState(); } }
export function saveState(state: LifeState) { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(state)); }
export function exportState(state: LifeState) { return JSON.stringify({ exportedAt: new Date().toISOString(), state }, null, 2); }
export function importState(raw: string) { const parsed = JSON.parse(raw); return (parsed.state || parsed) as LifeState; }
