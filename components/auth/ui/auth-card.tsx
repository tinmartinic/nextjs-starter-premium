'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  headerLabel: string;
  buttonHref: string;
  buttonLabel: string;
  className?: string;
}

const AuthCard = ({ children, headerLabel, buttonHref, buttonLabel, className }: AuthCardProps) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <h3>{headerLabel}</h3>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button variant="default" className="font-normal w-full" size="lg" asChild>
          <Link href={buttonHref}>{buttonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
