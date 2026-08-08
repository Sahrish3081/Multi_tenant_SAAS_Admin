ALTER TABLE "workspace_members" DROP CONSTRAINT "workspace_members_assigned_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "workspace_members" ALTER COLUMN "assigned_by" SET DATA TYPE varchar;