import { pgTable, text } from 'drizzle-orm/pg-core';

import users from './user';

const twoFactorConfirmation = pgTable('two_factor_confirmation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
});

export default twoFactorConfirmation;
