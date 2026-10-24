'use client';

import Link from 'next/link';

import ContentWrapper from '../global/content-width-wrapper';
import MaxWidthWrapper from '../global/max-width-wrapper';
import { Separator } from '../ui/separator';

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

const SOC_ITEMS: NavigationProps[] = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Dribble', href: 'https://dribbble.com' },
];

export default function Footer() {
  return (
    <MaxWidthWrapper>
      <Separator className="bg-secondary-foreground/10 " />
      <ContentWrapper>
        <footer className="w-full relative bottom-0 py-8 z-20">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
            <div className="flex flex-col items-start">
              <h4 className="font-semibold text-sm md:text-xl text-secondary-foreground">Logo</h4>
              <p className="py-2 text-xs">
                Developed by{' '}
                <Link
                  aria-label="Neviox Digital Agency"
                  href="https://nevioxdigital.com/"
                  className="font-bold"
                >
                  Neviox Digital
                </Link>
              </p>
            </div>

            <div className="flex flex-row gap-16">
              <div className="flex flex-col items-start">
                <h5 className="text-primary py-2 text-sm md:text-xl font-semibold">Navigation</h5>
                <div className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      aria-label={`WebStarter - ${item.label}`}
                      href={item.href}
                      className="hover:text-secondary-foreground/70 focus:text-secondary-foreground/70 active:text-secondary-foreground/70 text-xs md:text-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start">
                <h5 className="text-primary py-2 text-sm md:text-xl font-semibold">Social Links</h5>
                <div className="flex flex-col gap-2">
                  {SOC_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      aria-label={`WebStarter - ${item.label}`}
                      href={item.href}
                      className="hover:text-secondary-foreground/70 focus:text-secondary-foreground/70 active:text-secondary-foreground/70 text-xs md:text-lg"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </ContentWrapper>
    </MaxWidthWrapper>
  );
}
