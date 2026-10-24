import { relations } from 'drizzle-orm';
import { json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import posts from './post';
import subscriptionPlan from './subscription-plan';
import users from './user';

const subscriptions = pgTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique().notNull(),
  stripeStatus: text('stripe_status').notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  nextBillingDate: timestamp('next_billing_date', { mode: 'date' }),
  lastBillingDate: timestamp('last_billing_date', { mode: 'date' }),
  paymentStatus: text('payment_status'),
  metadata: json('metadata'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),

  userId: text('user_id').notNull(),
  postId: text('post_id').notNull(),
  subscriptionPlanId: text('subscription_plan_id'),
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
    relationName: 'userSubscriptions',
  }),
  post: one(posts, {
    fields: [subscriptions.postId],
    references: [posts.id],
  }),
  subscriptionPlan: one(subscriptionPlan, {
    fields: [subscriptions.subscriptionPlanId],
    references: [subscriptionPlan.id],
  }),
}));

export default subscriptions;
