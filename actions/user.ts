'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema';
import { User } from '@/models/types';

export async function updateUser(userId: string, data: Partial<User>) {
  try {
    const updatedUser = await db
      .update(user)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    return { success: true, message: 'User updated successfully!', updatedUser };
  } catch (err) {
    console.error('Error updating user:', err);
    return {
      error: 'Failed to update user',
    };
  }
}
