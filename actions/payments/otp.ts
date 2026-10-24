'use server';

import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { getPostById } from '@/data/post';
import { getUserById, getUserByStripeCustomerId } from '@/data/user';
import { db } from '@/lib/db/drizzle';
import { transaction, user as users } from '@/lib/db/schema';

export async function handlePayment(event: Stripe.Event, status: string) {
  const invoice = event.data.object as Stripe.Invoice;
  const user = await getUserByStripeCustomerId(invoice.customer as string);

  if (!user) {
    return { error: 'User not found' };
  }

  const paymentIntentId = invoice.payment_intent?.toString();
  if (!paymentIntentId) {
    return { error: 'Payment intent ID not found' };
  }
  const amount = invoice.amount_paid.toString();

  await db
    .update(transaction)
    .set({
      stripeStatus: status,
      amount: amount,
      purchaseDate: new Date(invoice.period_start * 1000),
      paymentStatus: status,
      metadata: invoice.metadata || {},
      userId: user.id,
    })
    .where(eq(transaction.stripePaymentIntentId, paymentIntentId));

  console.log(`Payment updated for payment intent: ${paymentIntentId}`);
}

export async function createTransactionOnStripeCreation(
  paymentData: {
    userId: string;
    stripePaymentIntentId: string;
    postId: string;
    createdTimestamp: number;
    stripeCustomerId: string;
    price: string;
    metadata: string | Record<string, unknown>;
  },
  payment_status: string,
) {
  try {
    const user = await getUserById(paymentData.userId as string);

    if (!user) {
      return { error: 'User not found.' };
    }

    const post = await getPostById(paymentData.postId as string);
    if (!post) {
      return { error: 'Post not found.' };
    }

    await db
      .insert(transaction)
      .values({
        stripePaymentIntentId: paymentData.stripePaymentIntentId,
        stripeStatus: payment_status,
        amount: paymentData.price,
        purchaseDate: new Date(paymentData.createdTimestamp * 1000),
        paymentStatus: payment_status,
        userId: paymentData.userId,
        postId: paymentData.postId,
        metadata: JSON.stringify(paymentData.metadata),
      })
      .execute();

    await db
      .update(users)
      .set({
        stripeCustomerId: paymentData.stripeCustomerId,
      })
      .where(eq(users.id, paymentData.userId))
      .execute();

    return {
      success: 'Successfully created subscription',
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      success: false,
      message: 'An error occurred while creating the subscription.',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
