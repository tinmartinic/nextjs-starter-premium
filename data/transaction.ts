'use server';

import { desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { post, transaction } from '@/lib/db/schema';
import { Post, Transaction } from '@/models/types';

export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    const otp = await db.select().from(transaction).where(eq(transaction.id, id)).execute();

    return otp[0] || null;
  } catch (error) {
    console.error('Error fetching transaction by ID:', error);
    return null;
  }
}

export async function getTransactionByUser(
  userId: string,
): Promise<(Transaction & { post: Post | null })[]> {
  try {
    const userTransactions = await db
      .select({
        id: transaction.id,
        stripePaymentIntentId: transaction.stripePaymentIntentId,
        stripeStatus: transaction.stripeStatus,
        amount: transaction.amount,
        purchaseDate: transaction.purchaseDate,
        paymentStatus: transaction.paymentStatus,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        userId: transaction.userId,
        postId: transaction.postId,
        post: post,
      })
      .from(transaction)
      .leftJoin(post, eq(transaction.postId, post.id))
      .where(eq(transaction.userId, userId))
      .orderBy(desc(transaction.createdAt))
      .execute();

    return (userTransactions as (Transaction & { post: Post | null })[]) || [];
  } catch (error) {
    console.error('Error fetching transactions by user:', error);
    return [];
  }
}

export async function getStripeTransactionById(
  stripeTransactionId: string,
): Promise<Transaction | null> {
  try {
    const otp = await db
      .select()
      .from(transaction)
      .where(eq(transaction.stripePaymentIntentId, stripeTransactionId))
      .execute();

    return otp[0] || null;
  } catch (error) {
    console.error('Error fetching stripe transaction by ID via payment intent ID:', error);
    return null;
  }
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactionList = await db.select().from(transaction).execute();

    return transactionList as Transaction[];
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    return [];
  }
};
