import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  deleteSubscription,
  handlePayment,
  updateSubscription,
} from '@/actions/payments/subscription';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await updateSubscription(event);
        break;

      case 'customer.subscription.deleted':
        await deleteSubscription(event);
        break;

      case 'invoice.payment_failed':
        await handlePayment(event, 'failed');
        break;

      case 'invoice.payment_succeeded':
        await handlePayment(event, 'succeeded');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return new NextResponse('Webhook processing error', { status: 500 });
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
