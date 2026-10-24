import { MousePointer2 } from 'lucide-react';
import Link from 'next/link';

import { clientSideRoute } from '@/routes';

export default function ServerSidePageExample() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-30rem)] p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Server-side page (SSR) successfully fetched!</h1>
      <p className="text-primary text-center mb-4">Learn the benefits of SSR!</p>
      <p className="text-secondary-foreground/80 text-center mb-6 max-w-3xl">
        With Server-Side Rendering (SSR), your page is dynamically generated on each request,
        ensuring up-to-date content, better SEO, and faster initial load times. This approach
        improves performance, enhances security, and provides a seamless user experience by
        preloading data before the page reaches the browser.
      </p>
      <Link className="flex gap-x-1 items-center group" href={clientSideRoute}>
        <p className="font-bold text-primary">Go to CSR Page</p>
        <MousePointer2 className="group-hover:-rotate-90 ease-in-out duration-150 text-primary" />
      </Link>
    </div>
  );
}
