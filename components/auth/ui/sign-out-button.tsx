'use client';

import { SignOut } from '@/actions/auth/sign-out';

interface SignOutButtonProps {
  children?: React.ReactNode;
}

export const SignOutButton = ({ children }: SignOutButtonProps) => {
  const onClick = () => {
    SignOut();
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
