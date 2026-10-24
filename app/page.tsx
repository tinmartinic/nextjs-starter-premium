import { MousePointer2 } from 'lucide-react';
import Link from 'next/link';

import { checkoutRoute } from '@/routes';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-30rem)]  p-6 rounded-lg">
      <h1 className="text-3xl font-bold  mb-4">Application Setup is Successful!</h1>
      <p className="text-primary text-center mb-4">You&apos;re ready to start shipping! 🎉</p>
      <p className="text-gray-500 text-center mb-6 max-w-3xl">
        Auth, database and payments are wired up. Replace this page with your product.
      </p>
      <Link className="flex gap-x-1 items-center group" href={checkoutRoute}>
        <p className="font-bold text-primary">Go to Checkout</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}
