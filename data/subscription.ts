'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { subscription, subscriptionPlan } from '@/lib/db/schema';
import { Subscription, SubscriptionPlan } from '@/models/types';

export const getAllSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const plans = await db.select().from(subscriptionPlan);
    return plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
};

export const getSubscriptionPlanById = async (id: string): Promise<SubscriptionPlan | null> => {
  try {
    const subscriptionPlanData = await db
      .select()
      .from(subscriptionPlan)
      .where(eq(subscriptionPlan.id, id))
      .limit(1)
      .execute();

    return subscriptionPlanData[0] || null;
  } catch (error) {
    console.error('Error fetching subscription plan by ID:', error);
    return null;
  }
};

export const getSubscriptionById = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    const subscriptionData = await db
      .select()
      .from(subscription)
      .where(eq(subscription.id, subscriptionId))
      .limit(1)
      .execute();

    return subscriptionData[0] || null;
  } catch (error) {
    console.error('Error fetching subscription by ID:', error);
    return null;
  }
};

export const getSubscriptionsByUser = async (userId: string): Promise<Subscription[]> => {
  try {
    const userSubscriptions = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, userId))
      .execute();

    return userSubscriptions;
  } catch (error) {
    console.error('Error fetching subscriptions by user ID:', error);
    return [];
  }
};

export const getSubscriptionBySubscriptionId = async (
  stripeSubscriptionId: string,
): Promise<Subscription | null> => {
  try {
    const subscriptionData = await db
      .select()
      .from(subscription)
      .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1)
      .execute();

    return subscriptionData[0] || null;
  } catch (error) {
    console.error('Error fetching subscription by Stripe subscription ID:', error);
    return null;
  }
};
