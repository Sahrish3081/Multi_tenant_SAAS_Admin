import {uuid,integer, pgTable, serial, varchar,timestamp, boolean,} from "drizzle-orm/pg-core";
/* User Table */
export const users = pgTable("users", {
 id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Password Reset Columns
  resetToken: varchar("reset_token", { length: 255 }).default(null),
  tokenExpiresAt: timestamp("token_expires_at"), // Token expire time
  isTokenUsed: boolean("is_token_used").default(false), // One-time verification check

  isEmailVerified:
    boolean("is_email_verified").default(
      false,
    ) /* check mail is verified or not */,
});
/* Work space table */
export const workspace = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  workspaceName: varchar("workspace_name", { length: 50 }).notNull(),
  //  createdBy: integer('created_by').notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
/* Workspace member table */
export const workspaceMembers = pgTable("workspace_members", {
 id: uuid("id").defaultRandom().primaryKey(),
  memberName: varchar("username", { length: 50 }).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id),

  role: varchar("role", { length: 20 }).notNull(),

  // assignedBy: varchar('assigned_by') .notNull(),
  assignedBy: uuid("assigned_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* Invitation table */

export const invitations = pgTable("invitations", {
 id: uuid("id").defaultRandom().primaryKey(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id),
  email: varchar("email", { length: 100 }).notNull(),
  invitedBy: uuid("invited_by")
    .notNull()
    .references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
