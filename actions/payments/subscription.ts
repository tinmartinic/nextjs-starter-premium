'use server';

import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { getPostById } from '@/data/post';
import { getSubscriptionById, getSubscriptionPlanById } from '@/data/subscription';
import { getUserById, getUserByStripeCustomerId } from '@/data/user';
import { db } from '@/lib/db/drizzle';
import { subscription } from '@/lib/db/schema';

import { activatePost, updatePost } from '../post';
import { updateDBSubscriptionByStripeSubscriptionId } from '../subscription';
import { updateUser } from '../user';

export async function updateSubscription(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const user = await getUserByStripeCustomerId(subscription.customer as string);
  const dbSubscription = await getSubscriptionById(subscription.id);

  if (!user) {
    return { error: 'User not found' };
  }
  if (!dbSubscription) {
    return { error: 'Subscription not found' };
  }
  if (dbSubscription) {
    const currentDate = new Date();

    if (dbSubscription?.stripeStatus != 'active' && dbSubscription.endDate < currentDate) {
      await updatePost(dbSubscription.postId, { status: 'ACTIVE' });
    }

    await updateDBSubscriptionByStripeSubscriptionId(subscription.id, {
      userId: user.id,
      stripeStatus: subscription.status,
      startDate: new Date(subscription.created * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      subscriptionPlanId: subscription.items.data[0]?.price.id,
    });
  }
}

export async function deleteSubscription(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const user = await getUserByStripeCustomerId(subscription.customer as string);

  if (!user) {
    return { error: 'User not found' };
  }

  await updateDBSubscriptionByStripeSubscriptionId(subscription.id, {
    userId: user.id,
    stripeStatus: 'canceled',
  });
}

export async function handlePayment(event: Stripe.Event, status: string) {
  const invoice = event.data.object as Stripe.Invoice;
  const user = await getUserByStripeCustomerId(invoice.customer as string);

  if (!user) {
    return { error: 'User not found' };
  }
  await updateDBSubscriptionByStripeSubscriptionId(invoice.subscription as string, {
    paymentStatus: status,
    lastBillingDate: new Date(invoice.period_start * 1000),
    nextBillingDate: new Date(invoice.period_end * 1000),
  });
}

export async function cancelSubscription(stripeSubscriptionId: string) {
  await updateDBSubscriptionByStripeSubscriptionId(stripeSubscriptionId, {
    stripeStatus: 'canceled',
  });

  return { success: 'Subscription successfully canceled!' };
}

export async function createSubscriptionOnStripeCreation(
  subscriptionData: {
    userId: string;
    subscriptionId: string;
    planId: string;
    postId: string;
    createdTimestamp: number;
    currentPeriodEndTimestamp: number;
    customerId: string;
  },
  payment_status: string,
) {
  try {
    const user = await getUserById(subscriptionData.userId as string);

    if (!user) {
      return { error: 'User not found.' };
    }
    const post = await getPostById(subscriptionData.postId as string);
    if (!post) {
      return { error: 'Post not found.' };
    }
    const subscriptionPlan = await getSubscriptionPlanById(subscriptionData.planId as string);
    if (!subscriptionPlan) {
      return { error: 'Subscription plan not found.' };
    }

    const existingSubscription = await db
      .select()
      .from(subscription)
      .where(eq(subscription.postId, post.id))
      .execute();

    if (existingSubscription) {
      return { error: 'User already has an active or processing subscription for this listing.' };
    }

    await db
      .insert(subscription)
      .values({
        userId: user?.id as string,
        postId: post?.id as string,
        stripeSubscriptionId: subscriptionData.subscriptionId,
        stripeStatus: 'processing',
        startDate: new Date(subscriptionData.createdTimestamp * 1000),
        endDate: new Date(subscriptionData.currentPeriodEndTimestamp * 1000),
        subscriptionPlanId: subscriptionPlan?.id as string,
        paymentStatus: payment_status,
        lastBillingDate: new Date(subscriptionData.createdTimestamp * 1000),
        nextBillingDate: new Date(subscriptionData.currentPeriodEndTimestamp * 1000),
      })
      .execute();

    await updateUser(user.id, { stripeCustomerId: subscriptionData.customerId });

    await activatePost(post.id as string);

    return {
      success: 'Successfully created subscription',
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      error: 'An error occurred while creating the subscription.',
    };
  }
}
