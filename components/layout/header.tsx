'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';

import ThemeToggler from '@/components/global/theme-toggler';
import { loginRoute } from '@/routes';

import { ProfileButton } from '../auth/ui/profile-button';
import ContentWrapper from '../global/content-width-wrapper';
import MaxWidthWrapper from '../global/max-width-wrapper';
import { Button } from '../ui/button';
import { SideBar } from './sidebar';

type NavigationProps = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavigationProps[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
];

type HeaderUser = { name?: string | null; email?: string | null; image?: string | null };

export default function Header({ user }: { user?: HeaderUser | null }) {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setMobile(window.innerWidth < 1200);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MaxWidthWrapper>
      <div className="fixed w-full z-50 text-secondary-foreground">
        {isMobile ? (
          <header className="fixed w-full top-0">
            <nav className="flex px-4 items-center justify-between py-4 w-full z-50  shadow-lg">
              <div className="flex items-center ">
                <Link aria-label="WebStarter" href={process.env.NEXT_PUBLIC_BASE_URL as string}>
                  <h1 className="text-xl font-bold text-secondary-foreground">Logo</h1>
                </Link>
              </div>
              <SideBar navitems={NAV_ITEMS} />
            </nav>
          </header>
        ) : (
          <header className="fixed w-full top-0 shadow-lg">
            <ContentWrapper>
              <nav className="grid grid-cols-3 items-center p-4 w-full">
                <div className="flex justify-start">
                  <Link aria-label="WebStarter" href={process.env.NEXT_PUBLIC_BASE_URL as string}>
                    <h1 className="text-xl font-bold text-secondary-foreground">Logo</h1>
                  </Link>
                </div>
                <div className="flex space-x-12 justify-center text-sm text-secondary-foreground   col-span-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      aria-label={`Julio Juraga - ${item.label}`}
                      href={item.href}
                      className="hover:text-primary focus:text-primary active:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="flex col-span-1 justify-end items-center space-x-4">
                  <Button className="bg-muted-foreground p-4">
                    <Link href="/contact">Lets Connect &rarr;</Link>
                  </Button>
                  {user ? (
                    <ProfileButton user={user} />
                  ) : (
                    <Link href={loginRoute}>
                      <Button className="rounded-lg bg-primary p-4">Sign In &rarr;</Button>
                    </Link>
                  )}
                  <ThemeToggler />
                </div>
              </nav>
            </ContentWrapper>
          </header>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
