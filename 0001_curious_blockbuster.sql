CREATE TABLE `decisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`title` varchar(240) NOT NULL,
	`context` text,
	`optionsJson` text,
	`expectedOutcome` text,
	`risks` text,
	`chosenOption` text,
	`why` text,
	`decisionDate` timestamp NOT NULL,
	`reviewDate` timestamp,
	`actualOutcome` text,
	CONSTRAINT `decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `focus_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`taskId` int,
	`startedAt` timestamp NOT NULL,
	`endedAt` timestamp,
	`minutes` int NOT NULL DEFAULT 0,
	`status` enum('active','completed','cancelled') NOT NULL DEFAULT 'active',
	CONSTRAINT `focus_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`areaId` int,
	`title` varchar(240) NOT NULL,
	`description` text,
	`why` text,
	`deadline` timestamp,
	`priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`status` enum('not-started','active','paused','completed','archived') NOT NULL DEFAULT 'active',
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`habitId` int NOT NULL,
	`loggedDate` timestamp NOT NULL,
	`note` text,
	CONSTRAINT `habit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`areaId` int,
	`goalId` int,
	`name` varchar(240) NOT NULL,
	`frequency` varchar(120) NOT NULL,
	`description` text,
	`startDate` timestamp,
	`scheduleJson` text,
	CONSTRAINT `habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`areaId` int,
	`goalId` int,
	`projectId` int,
	`title` varchar(240) NOT NULL,
	`body` text NOT NULL,
	`mood` varchar(80),
	`entryDate` timestamp NOT NULL,
	`isFavorite` int NOT NULL DEFAULT 0,
	`archivedAt` timestamp,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `life_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(120) NOT NULL,
	`color` varchar(24) NOT NULL,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`archivedAt` timestamp,
	CONSTRAINT `life_areas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`projectId` int NOT NULL,
	`name` varchar(240) NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`status` enum('not-started','active','paused','completed','archived') NOT NULL DEFAULT 'not-started',
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `life_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`displayName` varchar(160) NOT NULL,
	`role` varchar(160),
	`initials` varchar(8),
	`vision` text,
	`direction` text,
	`valuesJson` text,
	CONSTRAINT `life_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`areaId` int,
	`goalId` int,
	`name` varchar(240) NOT NULL,
	`description` text,
	`deadline` timestamp,
	`status` enum('planning','active','paused','completed','archived') NOT NULL DEFAULT 'planning',
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`areaId` int,
	`goalId` int,
	`projectId` int,
	`milestoneId` int,
	`title` varchar(240) NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`status` enum('inbox','planned','in-progress','completed','cancelled') NOT NULL DEFAULT 'planned',
	`estimatedMinutes` int NOT NULL DEFAULT 30,
	`tagsJson` text,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeline_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`category` enum('milestone','task','journal','project','goal','decision','memory') NOT NULL,
	`title` varchar(240) NOT NULL,
	`description` text,
	`eventDate` timestamp NOT NULL,
	`sourceType` varchar(80),
	`sourceId` int,
	CONSTRAINT `timeline_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `decisions_user_idx` ON `decisions` (`userId`);--> statement-breakpoint
CREATE INDEX `focus_user_idx` ON `focus_sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `focus_task_idx` ON `focus_sessions` (`taskId`);--> statement-breakpoint
CREATE INDEX `goals_user_idx` ON `goals` (`userId`);--> statement-breakpoint
CREATE INDEX `goals_area_idx` ON `goals` (`areaId`);--> statement-breakpoint
CREATE INDEX `habit_logs_habit_idx` ON `habit_logs` (`habitId`);--> statement-breakpoint
CREATE INDEX `habit_logs_user_idx` ON `habit_logs` (`userId`);--> statement-breakpoint
CREATE INDEX `habits_user_idx` ON `habits` (`userId`);--> statement-breakpoint
CREATE INDEX `journal_user_idx` ON `journal_entries` (`userId`);--> statement-breakpoint
CREATE INDEX `journal_date_idx` ON `journal_entries` (`entryDate`);--> statement-breakpoint
CREATE INDEX `areas_user_idx` ON `life_areas` (`userId`);--> statement-breakpoint
CREATE INDEX `milestones_user_idx` ON `milestones` (`userId`);--> statement-breakpoint
CREATE INDEX `milestones_project_idx` ON `milestones` (`projectId`);--> statement-breakpoint
CREATE INDEX `profiles_user_idx` ON `life_profiles` (`userId`);--> statement-breakpoint
CREATE INDEX `projects_user_idx` ON `projects` (`userId`);--> statement-breakpoint
CREATE INDEX `projects_goal_idx` ON `projects` (`goalId`);--> statement-breakpoint
CREATE INDEX `tasks_user_idx` ON `tasks` (`userId`);--> statement-breakpoint
CREATE INDEX `tasks_due_idx` ON `tasks` (`dueDate`);--> statement-breakpoint
CREATE INDEX `tasks_project_idx` ON `tasks` (`projectId`);--> statement-breakpoint
CREATE INDEX `timeline_user_idx` ON `timeline_events` (`userId`);--> statement-breakpoint
CREATE INDEX `timeline_date_idx` ON `timeline_events` (`eventDate`);