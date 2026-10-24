'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { post } from '@/lib/db/schema';
import { Post, PostStatusEnum } from '@/models/types';

export async function updatePost(postId: string, data: Partial<Post>) {
  try {
    const updatedPost = await db
      .update(post)
      .set(data)
      .where(eq(post.id, postId))
      .returning();

    return { success: true, message: 'Post updated successfully!', updatedPost };
  } catch (err) {
    console.error('Error updating post:', err);
    return {
      error: 'Failed to update post',
    };
  }
}

export async function activatePost(postId: string) {
  await updatePost(postId, { status: PostStatusEnum.ACTIVE });

  return { success: 'Listing successfully activated!' };
}
