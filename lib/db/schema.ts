import { pgTable, uuid, text, integer, timestamp, decimal, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 支付状态枚举
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed']);

// 用户表（扩展 Supabase Auth）
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  credits: integer('credits').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 支付历史表
export const paymentHistory = pgTable('payment_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderNo: text('order_no').notNull().unique(),
  tradeNo: text('trade_no'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  credits: integer('credits').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 项目表
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  step1Description: text('step1_description'),
  step2Questions: jsonb('step2_questions'),
  step2Answers: text('step2_answers'),
  step3Documents: jsonb('step3_documents'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// 关系定义
export const usersRelations = relations(users, ({ many }) => ({
  paymentHistory: many(paymentHistory),
  projects: many(projects),
}));

export const paymentHistoryRelations = relations(paymentHistory, ({ one }) => ({
  user: one(users, {
    fields: [paymentHistory.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

// 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type NewPaymentHistory = typeof paymentHistory.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
