'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { FormEvent, useEffect, useState } from 'react';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { createTransactionOnStripeCreation } from '@/actions/payments/otp';
import { Post, User } from '@/models/types';
import { paymentSuccessRoute } from '@/routes';

import { Button } from '../ui/button';

export default function StripeCheckoutForm({
  selectedPost,
  user,
}: {
  selectedPost: Post;
  user: User;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setLoading] = useState(false);

  const [paymentData, setPaymentData] = useState<null | {
    userId: string;
    stripePaymentIntentId: string;
    postId: string;
    createdTimestamp: number;
    stripeCustomerId: string;
    price: string;
    metadata: string;
  }>(null);

  useEffect(() => {
    if (!selectedPost || !user || clientSecret) return;

    const createPayment = async () => {
      try {
        const response = await fetch('/api/stripe/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            price: selectedPost.price,
            postId: selectedPost.id,
          }),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message || 'An error occurred while creating the payment.');
        }

        setClientSecret(data.clientSecret);

        const newPaymentData = {
          userId: user.id,
          stripePaymentIntentId: data.paymentData.stripePaymentIntentId,
          postId: selectedPost.id,
          createdTimestamp: data.paymentData.createdTimestamp,
          stripeCustomerId: data.paymentData.stripeCustomerId,
          price: String(selectedPost.price),
          metadata: JSON.stringify(data.paymentData.metadata),
        };

        setPaymentData(newPaymentData);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      }
    };

    createPayment();
  }, [selectedPost, user, clientSecret]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!paymentData || !paymentData.price || Number(paymentData.price) <= 0) {
      setErrorMessage('Invalid price. Payment cannot proceed.');
      setLoading(false);
      return;
    }

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
        setErrorMessage(paymentResult.error.message as string);
        return;
      }

      if (paymentResult.paymentIntent && paymentData) {
        const response = await createTransactionOnStripeCreation(
          paymentData,
          paymentResult.paymentIntent.status,
        );

        if (response.error) {
          toast.error(response.error);
          setErrorMessage(response.error);
        } else {
          toast.success('Payment Successful!');
          router.push(paymentSuccessRoute);
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
    <form onSubmit={handleSubmit} className="border-2 border-gray-950 p-8 rounded-md">
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <Button
        disabled={!stripe || isLoading}
        className="text-white w-full rounded-md font-bold disabled:opacity-50 disabled:animate-pulse mt-12"
      >
        {!isLoading ? `Pay ${selectedPost.price}  € for ${selectedPost.title}` : 'Processing...'}
      </Button>
    </form>
  );
}
