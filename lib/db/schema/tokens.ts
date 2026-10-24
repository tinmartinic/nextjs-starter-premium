import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

const verificationToken = pgTable(
  'verification_token',
  {
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (verificationToken) => [
    primaryKey({ columns: [verificationToken.email, verificationToken.token] }),
  ],
);

const passwordResetToken = pgTable('password_reset_token', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  email: text('email').notNull(),
  token: text('token').unique().notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

const twoFactorToken = pgTable('two_factor_token', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  email: text('email').notNull(),
  token: text('token').unique().notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export { passwordResetToken, twoFactorToken, verificationToken };
