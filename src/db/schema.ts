import { pgTable, serial, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  image: text('image'),
  role: text('role').notNull().default('citizen'), // citizen, government, admin
  department: text('department'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  used: boolean('used').default(false),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  departmentId: integer('department_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const complaints = pgTable('complaints', {
  id: serial('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull().unique(),
  userId: integer('user_id'), // Make this optional (no notNull constraint)
  anonymous: boolean('anonymous').default(false),
  categoryId: integer('category_id').references(() => categories.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  location: text('location'),
  geoCoordinates: json('geo_coordinates'),
  attachments: json('attachments'),
  status: text('status').notNull().default('submitted'), // submitted, in_progress, resolved, closed
  rating: integer('rating'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const statusHistory = pgTable('status_history', {
  id: serial('id').primaryKey(),
  complaintId: integer('complaint_id').references(() => complaints.id),
  status: text('status').notNull(),
  comment: text('comment'),
  updatedBy: integer('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const responses = pgTable('responses', {
  id: serial('id').primaryKey(),
  complaintId: integer('complaint_id').references(() => complaints.id),
  responderId: integer('responder_id').references(() => users.id),
  response: text('response').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});