import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb, getUserGoals, getUserProjects, getUserTodayTasks } from "./db";
import { goals, projects, tasks } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  life: router({
    snapshot: protectedProcedure.query(async ({ ctx }) => {
      const [userGoals, userProjects, userTasks] = await Promise.all([
        getUserGoals(ctx.user.id),
        getUserProjects(ctx.user.id),
        getUserTodayTasks(ctx.user.id, new Date(), new Date()),
      ]);
      return { goals: userGoals, projects: userProjects, tasks: userTasks };
    }),
    createGoal: protectedProcedure.input(z.object({ title: z.string().min(1).max(240), description: z.string().max(5000).optional(), areaId: z.number().int().optional(), deadline: z.coerce.date().optional(), priority: z.enum(["high", "medium", "low"]).default("medium") })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Database unavailable");
      const [created] = await db.insert(goals).values({ userId: ctx.user.id, title: input.title, description: input.description ?? null, areaId: input.areaId ?? null, deadline: input.deadline ?? null, priority: input.priority, status: "active" });
      return created;
    }),
    createProject: protectedProcedure.input(z.object({ name: z.string().min(1).max(240), description: z.string().max(5000).optional(), areaId: z.number().int().optional(), goalId: z.number().int().optional(), deadline: z.coerce.date().optional() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Database unavailable");
      const [created] = await db.insert(projects).values({ userId: ctx.user.id, name: input.name, description: input.description ?? null, areaId: input.areaId ?? null, goalId: input.goalId ?? null, deadline: input.deadline ?? null, status: "planning" });
      return created;
    }),
    completeTask: protectedProcedure.input(z.object({ id: z.number().int(), completed: z.boolean() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Database unavailable");
      await db.update(tasks).set({ status: input.completed ? "completed" : "planned", updatedAt: new Date() }).where(and(eq(tasks.id, input.id), eq(tasks.userId, ctx.user.id)));
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
