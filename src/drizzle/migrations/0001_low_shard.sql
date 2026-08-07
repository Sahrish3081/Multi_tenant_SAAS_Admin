ALTER TABLE "users" ADD COLUMN "token_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_token_used" boolean DEFAULT false;