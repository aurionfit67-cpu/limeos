import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

const owner = { userId: int("userId").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull() };

export const profiles = mysqlTable("life_profiles", { id: int("id").autoincrement().primaryKey(), ...owner, displayName: varchar("displayName", { length: 160 }).notNull(), role: varchar("role", { length: 160 }), initials: varchar("initials", { length: 8 }), vision: text("vision"), direction: text("direction"), valuesJson: text("valuesJson") }, (table) => ({ userIdx: index("profiles_user_idx").on(table.userId) }));
export const lifeAreas = mysqlTable("life_areas", { id: int("id").autoincrement().primaryKey(), ...owner, name: varchar("name", { length: 120 }).notNull(), color: varchar("color", { length: 24 }).notNull(), description: text("description"), sortOrder: int("sortOrder").default(0).notNull(), archivedAt: timestamp("archivedAt") }, (table) => ({ userIdx: index("areas_user_idx").on(table.userId) }));
export const goals = mysqlTable("goals", { id: int("id").autoincrement().primaryKey(), ...owner, areaId: int("areaId"), title: varchar("title", { length: 240 }).notNull(), description: text("description"), why: text("why"), deadline: timestamp("deadline"), priority: mysqlEnum("priority", ["high", "medium", "low"]).default("medium").notNull(), status: mysqlEnum("status", ["not-started", "active", "paused", "completed", "archived"]).default("active").notNull() }, (table) => ({ userIdx: index("goals_user_idx").on(table.userId), areaIdx: index("goals_area_idx").on(table.areaId) }));
export const projects = mysqlTable("projects", { id: int("id").autoincrement().primaryKey(), ...owner, areaId: int("areaId"), goalId: int("goalId"), name: varchar("name", { length: 240 }).notNull(), description: text("description"), deadline: timestamp("deadline"), status: mysqlEnum("status", ["planning", "active", "paused", "completed", "archived"]).default("planning").notNull() }, (table) => ({ userIdx: index("projects_user_idx").on(table.userId), goalIdx: index("projects_goal_idx").on(table.goalId) }));
export const milestones = mysqlTable("milestones", { id: int("id").autoincrement().primaryKey(), ...owner, projectId: int("projectId").notNull(), name: varchar("name", { length: 240 }).notNull(), description: text("description"), dueDate: timestamp("dueDate"), status: mysqlEnum("status", ["not-started", "active", "paused", "completed", "archived"]).default("not-started").notNull() }, (table) => ({ userIdx: index("milestones_user_idx").on(table.userId), projectIdx: index("milestones_project_idx").on(table.projectId) }));
export const tasks = mysqlTable("tasks", { id: int("id").autoincrement().primaryKey(), ...owner, areaId: int("areaId"), goalId: int("goalId"), projectId: int("projectId"), milestoneId: int("milestoneId"), title: varchar("title", { length: 240 }).notNull(), description: text("description"), dueDate: timestamp("dueDate"), priority: mysqlEnum("priority", ["high", "medium", "low"]).default("medium").notNull(), status: mysqlEnum("status", ["inbox", "planned", "in-progress", "completed", "cancelled"]).default("planned").notNull(), estimatedMinutes: int("estimatedMinutes").default(30).notNull(), tagsJson: text("tagsJson") }, (table) => ({ userIdx: index("tasks_user_idx").on(table.userId), dueIdx: index("tasks_due_idx").on(table.dueDate), projectIdx: index("tasks_project_idx").on(table.projectId) }));
export const habits = mysqlTable("habits", { id: int("id").autoincrement().primaryKey(), ...owner, areaId: int("areaId"), goalId: int("goalId"), name: varchar("name", { length: 240 }).notNull(), frequency: varchar("frequency", { length: 120 }).notNull(), description: text("description"), startDate: timestamp("startDate"), scheduleJson: text("scheduleJson") }, (table) => ({ userIdx: index("habits_user_idx").on(table.userId) }));
export const habitLogs = mysqlTable("habit_logs", { id: int("id").autoincrement().primaryKey(), ...owner, habitId: int("habitId").notNull(), loggedDate: timestamp("loggedDate").notNull(), note: text("note") }, (table) => ({ habitIdx: index("habit_logs_habit_idx").on(table.habitId), userIdx: index("habit_logs_user_idx").on(table.userId) }));
export const journalEntries = mysqlTable("journal_entries", { id: int("id").autoincrement().primaryKey(), ...owner, areaId: int("areaId"), goalId: int("goalId"), projectId: int("projectId"), title: varchar("title", { length: 240 }).notNull(), body: text("body").notNull(), mood: varchar("mood", { length: 80 }), entryDate: timestamp("entryDate").notNull(), isFavorite: int("isFavorite").default(0).notNull(), archivedAt: timestamp("archivedAt") }, (table) => ({ userIdx: index("journal_user_idx").on(table.userId), dateIdx: index("journal_date_idx").on(table.entryDate) }));
export const timelineEvents = mysqlTable("timeline_events", { id: int("id").autoincrement().primaryKey(), ...owner, category: mysqlEnum("category", ["milestone", "task", "journal", "project", "goal", "decision", "memory"]).notNull(), title: varchar("title", { length: 240 }).notNull(), description: text("description"), eventDate: timestamp("eventDate").notNull(), sourceType: varchar("sourceType", { length: 80 }), sourceId: int("sourceId") }, (table) => ({ userIdx: index("timeline_user_idx").on(table.userId), dateIdx: index("timeline_date_idx").on(table.eventDate) }));
export const decisions = mysqlTable("decisions", { id: int("id").autoincrement().primaryKey(), ...owner, title: varchar("title", { length: 240 }).notNull(), context: text("context"), optionsJson: text("optionsJson"), expectedOutcome: text("expectedOutcome"), risks: text("risks"), chosenOption: text("chosenOption"), why: text("why"), decisionDate: timestamp("decisionDate").notNull(), reviewDate: timestamp("reviewDate"), actualOutcome: text("actualOutcome") }, (table) => ({ userIdx: index("decisions_user_idx").on(table.userId) }));
export const focusSessions = mysqlTable("focus_sessions", { id: int("id").autoincrement().primaryKey(), ...owner, taskId: int("taskId"), startedAt: timestamp("startedAt").notNull(), endedAt: timestamp("endedAt"), minutes: int("minutes").default(0).notNull(), status: mysqlEnum("status", ["active", "completed", "cancelled"]).default("active").notNull() }, (table) => ({ userIdx: index("focus_user_idx").on(table.userId), taskIdx: index("focus_task_idx").on(table.taskId) }));

export type LifeProfile = typeof profiles.$inferSelect;
export type LifeArea = typeof lifeAreas.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
