import { describe, expect, it } from "vitest";
import { calculateProgress, calculateStreak, initialLifeState, progressForGoal, progressForProject, today } from "./life-store";

describe("Life OS deterministic calculations", () => {
  it("starts empty for onboarding instead of shipping personal data", () => {
    const stats = calculateProgress(initialLifeState);
    expect(initialLifeState.goals).toHaveLength(0);
    expect(initialLifeState.tasks).toHaveLength(0);
    expect(stats.todayCount).toBe(0);
    expect(stats.missionCompletion).toBe(0);
  });

  it("uses the runtime date for new-day calculations", () => {
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("derives project and goal progress from connected state", () => {
    const state = structuredClone(initialLifeState);
    state.milestones = [
      { id: "m1", name: "Done", projectId: "p1", dueDate: today, status: "completed" },
      { id: "m2", name: "Next", projectId: "p1", dueDate: today, status: "active" },
    ];
    state.projects = [{ id: "p1", name: "Project", description: "", areaId: "", goalId: "g1", deadline: today, status: "active" }];
    state.goals = [{ id: "g1", title: "Goal", description: "", why: "", areaId: "", deadline: today, priority: "medium", status: "active" }];
    expect(progressForProject(state, "p1")).toBe(50);
    expect(progressForGoal(state, "g1")).toBe(50);
  });

  it("calculates a habit streak from completed dates", () => {
    const yesterday = new Date(`${today}T12:00:00`);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(calculateStreak([today, yesterday.toISOString().slice(0, 10)])).toBe(2);
    expect(calculateStreak([])).toBe(0);
  });

  it("keeps mission completion within 0 and 100", () => {
    const state = structuredClone(initialLifeState);
    state.tasks = [{ id: "t1", title: "Today", dueDate: today, priority: "medium", status: "completed", estimatedMinutes: 20, tags: [] }];
    const stats = calculateProgress(state);
    expect(stats.missionCompletion).toBe(100);
    expect(stats.missionCompletion).toBeGreaterThanOrEqual(0);
    expect(stats.missionCompletion).toBeLessThanOrEqual(100);
  });
});
