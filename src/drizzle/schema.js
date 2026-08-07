import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  
  // Password Reset Columns
  resetToken: varchar('reset_token', { length: 255 }).default(null),
  tokenExpiresAt: timestamp('token_expires_at'), // Token expire time
  isTokenUsed: boolean('is_token_used').default(false), // One-time verification check

isEmailVerified: boolean('is_email_verified').default(false),/* check mail is verified or not */
});
