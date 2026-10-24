import { MousePointer2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { loginRoute } from '@/routes';

export const metadata: Metadata = {
  title: '401',
  description: 'User not logged in!',
};

export default function NotLoggedIn() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-30rem)]">
      <h1 className="text-2xl font-semibold ">User not logged in!</h1>
      <p>Please log in to access this page.</p>
      <Link className="flex gap-x-1 items-center group" href={loginRoute}>
        <p className="font-bold text-primary">Go to Login</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}
