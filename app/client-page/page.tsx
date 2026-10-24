'use client';

import { MousePointer2 } from 'lucide-react';
import Link from 'next/link';

import { serverSideRoute } from '@/routes';

export default function ClientSidePageExample() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-30rem)] p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Client-side page (CSR) successfully loaded!</h1>
      <p className="text-primary text-center mb-4">Learn the benefits of CSR!</p>
      <p className="text-secondary-foreground/80 text-center mb-6 max-w-3xl">
        With Client-Side Rendering (CSR), your page loads faster after the initial request, as
        content is dynamically fetched and rendered in the browser. This improves interactivity,
        reduces server load, and provides a smooth experience, especially for highly dynamic
        applications that rely on real-time data updates with the focus on users interactivity of
        the page.
      </p>
      <Link className="flex gap-x-1 items-center group" href={serverSideRoute}>
        <p className="font-bold text-primary">Go to SSR Page</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}
