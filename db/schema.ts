import { pgTable, text, timestamp, integer, uuid, index } from 'drizzle-orm/pg-core';
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), author: text('author').notNull(), title: text('title').notNull(), category: text('category').notNull(), content: text('content').notNull(), status: text('status').notNull().default('pending'), kind: text('kind').notNull().default('text'), createdAt: timestamp('created_at').notNull().defaultNow(),
}, t => [index('submissions_status_idx').on(t.status), index('submissions_user_idx').on(t.userId)]);
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), buyerEmail: text('buyer_email').notNull(), bookId: text('book_id').notNull(), bookTitle: text('book_title').notNull(), sellerId: text('seller_id'), amountMad: integer('amount_mad').notNull().default(30), feeUsd: integer('fee_usd').notNull().default(0), status: text('status').notNull().default('pending'), paymentReference: text('payment_reference').unique(), payoutStatus: text('payout_status').notNull().default('not_due'), createdAt: timestamp('created_at').notNull().defaultNow(), confirmedAt: timestamp('confirmed_at'),
}, t => [index('orders_user_idx').on(t.userId),index('orders_seller_idx').on(t.sellerId)]);
