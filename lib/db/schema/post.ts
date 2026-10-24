import { relations } from 'drizzle-orm';
import { numeric, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import user from './user';

export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE']);

export const post = pgTable('post', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  title: text('title'),
  content: text('content'),
  image: text('image'),
  price: numeric('price').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  status: statusEnum().default('INACTIVE'),
});

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));

export default post;
