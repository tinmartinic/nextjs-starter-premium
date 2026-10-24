'use client';

import { useRouter } from 'next/navigation';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { loginRoute } from '@/routes';

import { AuthTabs } from './auth-tabs';

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

const AuthModal = ({ children, mode = 'redirect', asChild }: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(loginRoute);
  };

  if (mode === 'modal') {
    return (
      <Dialog>
        <DialogTitle className="hidden">Sign In</DialogTitle>
        <DialogDescription className="hidden">Sign In</DialogDescription>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent>
          <div className="p-4">
            <AuthTabs />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default AuthModal;
