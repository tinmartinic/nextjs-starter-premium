import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Geist, Geist_Mono } from 'next/font/google';

import { auth } from '@/auth';
import ContentWrapper from '@/components/global/content-width-wrapper';
import MaxWidthWrapper from '@/components/global/max-width-wrapper';
import { ThemeProvider } from '@/components/global/theme-provider';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';
import { currentUser } from '@/lib/auth';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) || null;
  const user = await currentUser();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MaxWidthWrapper>
              <Header user={user} />
              <ContentWrapper>
                <main className="relative flex flex-col min-h-screen ">
                  <div className="relative z-10 flex-grow flex-1 mt-20">{children}</div>
                </main>
              </ContentWrapper>
              <Footer />
              <Toaster />
            </MaxWidthWrapper>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL).origin
    : 'http://localhost:3000';

  const title = 'WebStarter - Your Ultimate Starter Kit for Rapid Web Development';
  const description =
    'Accelerate your web development journey with WebStarter. Our powerful starter kit enables developers to save time and money while building modern web apps using the latest technologies.';
  const keywords =
    'Web Development, Starter Kit, Software Solutions, WebStarter, Rapid Development, Next.js, Auth.js, NeonDB, Drizzle, Resend, Stripe, PostgreSQL';
  const locale = 'en-US';

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: title,
      template: 'WebStarter | %s',
    },

    description: description,
    keywords: keywords,

    openGraph: {
      title: {
        template: 'WebStarter | %s',
        default: title,
      },
      description: description,
      siteName: 'WebStarter',
      url: baseUrl,
      type: 'website',
      locale: locale,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },

    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },

    generator: 'Next.js',
    applicationName: 'WebStarter',

    other: {
      'x-ua-compatible': 'IE=edge',
      'content-type': 'text/html; charset=utf-8',
      'theme-color': '#040404',
    },

    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/android-chrome-512x512x.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png' }],
    },
  } satisfies Metadata;
}
