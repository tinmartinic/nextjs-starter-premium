import { NextResponse } from 'next/server';

import { getUserById } from '@/data/user';
import { stripe } from '@/lib/stripe';
import { profileRoute } from '@/routes';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const customerId = user.stripeCustomerId;
    if (!customerId) {
      return NextResponse.json({ error: 'Invalid Stripe customer ID' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}${profileRoute}`,
    });

    return NextResponse.json({
      message: 'Successfully redirected.',
      url: session.url,
    });
  } catch (error) {
    console.error('Error redirecting to billing page portal:', error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : 'Unexpected error' } },
      { status: 500 },
    );
  }
}
