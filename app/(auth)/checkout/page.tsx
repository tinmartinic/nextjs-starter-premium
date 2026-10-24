'use client';

import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ContentWrapper from '@/components/global/content-width-wrapper';
import StripeCheckoutForm from '@/components/global/stripe-checkout-form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getAllPosts } from '@/data/post';
import { getAllSubscriptionPlans } from '@/data/subscription';
import { getUserById } from '@/data/user';
import { useCurrentUser } from '@/hooks/use-current-user';
import convertToSubcurrency from '@/lib/helpers';
import { Post, SubscriptionPlan, User } from '@/models/types';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const user = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, userData, postsData] = await Promise.all([
          getAllSubscriptionPlans(),
          getUserById(user?.id as string),
          getAllPosts(),
        ]);

        setPlans(plansData || []);
        setPosts(postsData || []);
        setActiveUser(userData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [user?.id]);

  const handlePostChange = (postId: string) => {
    const selected = posts.find((post) => post.id === postId);
    setSelectedPost(selected || null);
  };

  const handlePlanChange = (planId: string) => {
    const selected = plans.find((plan) => plan.id === planId);
    setSelectedPlan(selected || null);
  };

  return (
    <ContentWrapper>
      <div className="flex flex-col md:flex-row min-h-screen mt-12">
        <div className="md:w-2/3 md:p-12 ">
          <h2 className="text-md md:text-xl font-semibold mb-4">Payment</h2>
          {selectedPost && selectedPlan && activeUser ? (
            <Elements
              stripe={stripePromise}
              options={{
                mode: 'payment',
                amount: convertToSubcurrency(selectedPlan.price.toString()),
                currency: 'eur',
              }}
            >
              <StripeCheckoutForm
                selectedPost={selectedPost}
                selectedPlan={selectedPlan}
                user={activeUser}
              />
            </Elements>
          ) : (
            <p>Please select a subscription plan to proceed with payment.</p>
          )}
        </div>

        <div className="md:w-1/3 h-full md:p-8 my-12">
          <div className="h-auto shadow-md shadow-primary border-t border-gray-950 p-12">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <Separator className="bg-gray-900" />

            <h3 className="text-lg font-semibold mt-6">Choose a Post Plan</h3>
            <Select name="planId" onValueChange={handlePostChange}>
              <SelectTrigger className="w-full mt-2 text-muted-foreground">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {posts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.title} - {post.price} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator className="bg-gray-900" />

            <h3 className="text-lg font-semibold mt-6">Choose a Subscription Plan</h3>
            <Select name="planId" onValueChange={handlePlanChange}>
              <SelectTrigger className="w-full mt-2 text-muted-foreground">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {plan.price} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button color="secondary" className="w-full mt-4">
              Choose Subscription
            </Button>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default CheckoutPage;
