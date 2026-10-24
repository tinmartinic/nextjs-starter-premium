import { relations } from 'drizzle-orm';
import { json, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import posts from './post';
import users from './user';

export const transaction = pgTable('transaction', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),

  stripePaymentIntentId: text('stripe_payment_intent_id').unique().notNull(),
  stripeStatus: text('stripe_status').notNull(),
  amount: numeric('amount').notNull(),
  purchaseDate: timestamp('purchase_date', { mode: 'date' }).defaultNow().notNull(),
  paymentStatus: text('payment_status').notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),

  userId: text('user_id').notNull(),
  postId: text('post_id').notNull(),
  subscriptionPlanId: text('subscription_plan_id'),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(users, {
    fields: [transaction.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [transaction.postId],
    references: [posts.id],
  }),
}));

export default transaction;
