import { MousePointer2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404',
  description: 'Something went wrong',
};

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-30rem)]">
      <h1 className="text-2xl font-semibold ">Page not found</h1>
      <p>The page you tried to access does not exist.</p>
      <Link className="flex gap-x-1 items-center group" href="/">
        <p className="font-bold text-primary">Go to Homepage</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}
