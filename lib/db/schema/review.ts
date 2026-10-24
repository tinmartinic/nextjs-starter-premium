import { relations } from 'drizzle-orm';
import { numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import post from './post';
import user from './user';

const review = pgTable('reviews', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  postId: text('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  rating: numeric('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [review.postId],
    references: [post.id],
  }),
}));

export default review;
