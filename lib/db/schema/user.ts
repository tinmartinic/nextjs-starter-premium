import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import post from './post';
import transaction from './transaction';
import twoFactorConfirmation from './two-factor-confirmation';

export const roleEnum = pgEnum('role', ['USER', 'MODERATOR', 'ADMIN']);

const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  password: text('password'),
  lastName: text('last_name'),
  image: text('image'),
  isSubscribed: boolean('is_subscribed').default(false),
  loginAttempts: integer('login_attempts').default(0),
  lockUntil: timestamp('lock_until', { mode: 'date' }),
  lastLogin: timestamp('last_login', { mode: 'date' }).defaultNow(),
  isTwoFactorEnabled: boolean('is_two_factor_enabled').default(false),
  twoFactorConfirmationId: text('two_factor_confirmation_id'),

  stripeCustomerId: text('stripe_customer_id'),

  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  role: roleEnum().default('USER'),
});

export const userRelations = relations(user, ({ many, one }) => ({
  posts: many(post),
  stripes: many(transaction),
  twoFactorConfirmation: one(twoFactorConfirmation, {
    fields: [user.twoFactorConfirmationId],
    references: [twoFactorConfirmation.id],
  }),
}));

export default user;
