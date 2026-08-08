ALTER TABLE "workspaces" RENAME COLUMN "workspaceName" TO "workspace_name";--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;