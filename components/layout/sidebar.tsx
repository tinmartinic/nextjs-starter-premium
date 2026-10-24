'use client';

import Link from 'next/link';

import { GiHamburgerMenu } from 'react-icons/gi';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Separator } from '../ui/separator';

type NavigationProps = {
  label: string;
  href: string;
};

type SideBarProps = {
  navitems: NavigationProps[];
};

export function SideBar({ navitems }: SideBarProps) {
  return (
    <div className="right-0 top-0">
      <Sheet>
        <SheetTrigger asChild>
          <Button>
            <GiHamburgerMenu />
          </Button>
        </SheetTrigger>
        <SheetContent side={'right'}>
          <SheetHeader>
            <SheetTitle className="text-secondary-foreground">Logo</SheetTitle>
            <SheetDescription>Description</SheetDescription>
            <Separator className="bg-secondary-foreground my-4" />
          </SheetHeader>
          <div className="grid gap-4 pt-12 justify-center text-center">
            {navitems.map((item) => (
              <Link key={item.label} aria-label={`WebStarter - ${item.label}`} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex justify-center pt-12">
            <Button className="bg-primary p-6 w-full">
              <Link href="/#kontakt">Lets Connect &rarr;</Link>
            </Button>
          </div>
          <Separator className="bg-secondary-foreground my-4" />
          <SheetFooter>
            <SheetClose asChild className="text-white bottom-0">
              <Button type="submit">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
