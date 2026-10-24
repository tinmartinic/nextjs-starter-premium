'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { subscription } from '@/lib/db/schema';
import { Subscription } from '@/models/types';

export async function updateDBSubscriptionByStripeSubscriptionId(
  subscriptionId: string,
  data: Partial<Subscription>,
) {
  try {
    const updatedSubscription = await db
      .update(subscription)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(subscription.stripeSubscriptionId, subscriptionId))
      .returning();

    return {
      success: true,
      message: 'Subscription updated successfully!',
      updatedUser: updatedSubscription,
    };
  } catch (err) {
    console.error('Error updating subscription:', err);
    return {
      error: 'Failed to update subscription',
    };
  }
}
