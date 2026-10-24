import { MousePointer2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { loginRoute } from '@/routes';

export const metadata: Metadata = {
  title: '403',
  description: 'Error using authorization',
};

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-30rem)]">
      <h1 className="text-2xl font-semibold ">Error connecting to OAuth</h1>

      <Link className="flex gap-x-1 items-center group" href={loginRoute}>
        <p className="font-bold text-primary">Go to Login</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}
