import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

import subscription from './subscription';

export const subscriptionPlanDurationEnum = pgEnum('subscription_plan_duration', [
  'MONTH',
  'BIANNUAL',
  'YEAR',
]);

const subscriptionPlan = pgTable('subscription_plans', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: text('name'),
  features: text('features').array(),
  price: integer('price').notNull(),
  isPopular: boolean('is_popular').default(false),
  stripePriceId: text('stripe_price_id'),
  duration: subscriptionPlanDurationEnum('duration').notNull(),
});

export const subscriptionPlanRelations = relations(subscriptionPlan, ({ many }) => ({
  subscriptions: many(subscription),
}));

export default subscriptionPlan;
