import { NextRequest, NextResponse } from 'next/server';

import { getUserById } from '@/data/user';
import { stripe } from '@/lib/stripe';

type InvoiceWithIntent = { payment_intent?: { client_secret: string | null } | null };

export async function POST(request: NextRequest) {
  const { userId, priceId, postId, planId } = await request.json();

  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId: string | null = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
      });

      customerId = customer.id;
    }

    if (customerId) {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return NextResponse.json({
        subscriptionData: {
          userId,
          subscriptionId: subscription.id,
          planId,
          postId,
          createdTimestamp: subscription.created,
          currentPeriodEndTimestamp: subscription.current_period_end,
          customerId,
        },
        clientSecret: (subscription.latest_invoice as InvoiceWithIntent | null)?.payment_intent
          ?.client_secret,
      });
    } else {
      throw new Error('Failed to create or retrieve Stripe customer ID.');
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : 'An error occurred' } },
      { status: 400 },
    );
  }
}
