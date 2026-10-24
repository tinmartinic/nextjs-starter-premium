'use client';

import { toast } from 'sonner';

import { FormEvent, useEffect, useState } from 'react';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { createSubscriptionOnStripeCreation } from '@/actions/payments/subscription';
import { Post, SubscriptionPlan, User } from '@/models/types';
import { paymentSuccessRoute } from '@/routes';

import { Button } from '../ui/button';

export default function StripeCheckoutForm({
  selectedPost,
  selectedPlan,
  user,
}: {
  selectedPost: Post;
  selectedPlan: SubscriptionPlan;
  user: User;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  const [subscriptionData, setSubscriptionData] = useState<null | {
    userId: string;
    subscriptionId: string;
    planId: string;
    postId: string;
    createdTimestamp: number;
    currentPeriodEndTimestamp: number;
    customerId: string;
  }>(null);

  useEffect(() => {
    if (!selectedPlan || !selectedPost || !user || clientSecret) return;

    const createSubscription = async () => {
      try {
        const response = await fetch('/api/stripe/subscription/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            priceId: selectedPlan.stripePriceId,
            planId: selectedPlan.id,
            postId: selectedPost.id,
          }),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(
            data.error.message || 'An error occurred while creating the subscription.',
          );
        }

        setClientSecret(data.clientSecret);

        const newSubscriptionData = {
          userId: user.id,
          subscriptionId: data.subscriptionData.subscriptionId,
          planId: selectedPlan.id,
          postId: selectedPost.id,
          createdTimestamp: data.subscriptionData.createdTimestamp,
          currentPeriodEndTimestamp: data.subscriptionData.currentPeriodEndTimestamp,
          customerId: data.subscriptionData.customerId,
        };

        setSubscriptionData(newSubscriptionData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      }
    };

    createSubscription();
  }, [selectedPlan, selectedPost, user, clientSecret]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!elements || !stripe || !clientSecret) {
        setErrorMessage('Stripe or elements not loaded.');
        return;
      }

      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message as string);
        return;
      }
      const paymentResult = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}${paymentSuccessRoute}`,
        },
        redirect: 'if_required',
      });

      if (paymentResult.error) {
        console.log(paymentResult.error);
        setErrorMessage(paymentResult.error.message as string);
        return;
      }

      if (paymentResult.paymentIntent && subscriptionData) {
        const response = await createSubscriptionOnStripeCreation(
          subscriptionData,
          paymentResult.paymentIntent.status,
        );

        if (response.error) {
          toast.error(response.error);
          setErrorMessage(response.error);
        } else {
          toast.success('Payment Successful! Subscription activated.');
        }
      } else {
        setErrorMessage('Payment intent is not available.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Something went wrong. Please try again.');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary text-primary p-2 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <Button
        disabled={!stripe || isLoading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!isLoading ? `Pay ${selectedPlan.price} €` : 'Processing...'}
      </Button>
    </form>
  );
}
