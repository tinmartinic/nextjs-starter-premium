import { NextRequest, NextResponse } from 'next/server';

import { cancelSubscription } from '@/actions/payments/subscription';
import { getSubscriptionById } from '@/data/subscription';
import { getUserById } from '@/data/user';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const { userId, subscriptionId } = await request.json();
  console.log(subscriptionId);
  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const subscription = await getSubscriptionById(subscriptionId);

    console.log(subscription);

    if (!subscription || subscription.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized or subscription not found' },
        { status: 403 },
      );
    }

    if (!subscription.id) {
      return NextResponse.json({
        error: 'No connected Stripe subscription found!',
      });
    }

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId as string);

    await cancelSubscription(subscription.stripeSubscriptionId as string);

    return NextResponse.json({
      message: 'Subscription cancellation requested',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : 'Unexpected error' } },
      { status: 400 },
    );
  }
}
