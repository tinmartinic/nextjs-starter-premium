'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { account } from '@/lib/db/schema';
import { Account } from '@/models/types';

export async function getAccountByUserId(userId: string): Promise<Account | null> {
  try {
    const result = await db.select().from(account).where(eq(account.userId, userId)).limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error fetching account by userId:', error);
    return null;
  }
}
