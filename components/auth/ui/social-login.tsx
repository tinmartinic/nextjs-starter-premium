'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const SocialLogin = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const handleClick = (provider: 'google' | 'facebook') => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button onClick={() => handleClick('google')} size="lg" variant="outline" className="w-1/2">
        <FcGoogle className="w-5 h-5" />
      </Button>
      <Button onClick={() => handleClick('facebook')} size="lg" variant="outline" className="w-1/2">
        <FaFacebook className="w-5 h-5" />
      </Button>
    </div>
  );
};
