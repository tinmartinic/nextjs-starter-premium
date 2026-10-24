import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getPostById } from '@/data/post';
import { getUserById } from '@/data/user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, postId, price } = body;
  const idempotencyKey = `payment_${userId}_${postId}_${Date.now()}`;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let customerId: string | null = user.stripeCustomerId ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
      });
      customerId = customer.id;
    }

    const amountInCents = Math.round(Number(price) * 100);

    const paymentIntent = await stripe.paymentIntents.create(
      {
        customer: customerId,
        amount: amountInCents,
        currency: 'eur',
        description: `Purchase of ${post.title} plan for €${(amountInCents / 100).toFixed(2)}`,
        receipt_email: user.email,
        automatic_payment_methods: { enabled: true },
        metadata: {
          userId: userId,
          postId: postId,
          currency: 'eur',
        },
      },
      { idempotencyKey },
    );

    return NextResponse.json({
      paymentData: {
        stripePaymentIntentId: paymentIntent.id,
        postId,
        createdTimestamp: paymentIntent.created,
        stripeCustomerId: customerId,
        price,
        metadata: {
          userId,
          postId,
          currency: 'eur',
        },
      },
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : 'An error occurred' } },
      { status: 400 },
    );
  }
}
