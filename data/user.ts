'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import users from '@/lib/db/schema/user';
import { User } from '@/models/types';

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).execute();

    return user[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await db.select().from(users).where(eq(users.email, email)).execute();

    return user[0] || null;
  } catch (error) {
    console.error('Error fetching user by Email:', error);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersList = await db.select().from(users).execute();

    return usersList;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export const getUserByStripeCustomerId = async (customerId: string): Promise<User | null> => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .execute();

    return user[0] || null;
  } catch (error) {
    console.error('Error fetching user by Stripe Customer ID:', error);
    return null;
  }
};
