import { MousePointer2 } from 'lucide-react';
import Link from 'next/link';

import { profileRoute } from '@/routes';

export default function SuccessfulPayment() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-30rem)]  p-6 ">
      <h1 className="text-3xl font-bold  mb-4">Payment Successful!</h1>
      <p className="text-primary text-center mb-4">
        Your purchase of WebStarter was successful! 🎉
      </p>
      <p className="text-gray-500 text-center mb-6 max-w-3xl">
        The invitation should be available in your GitHub inbox within a few minutes. For past
        payments, please visit your profile section. If you have any questions, feel free to contact
        us via support.
      </p>
      <Link className="flex gap-x-1 items-center group" href={profileRoute}>
        <p className="font-bold text-primary">Go to Profile</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}

export const generateMetadata = () => {
  return {
    title: 'Successful Payment',
    description: 'Thank you for your payment!',

    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },

  };
};
