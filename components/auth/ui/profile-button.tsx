import Image from 'next/image';
import Link from 'next/link';

import AvatarImage from '@/components/global/avatar-image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { avatar } from '@/public/image';
import { profileRoute } from '@/routes';

import AuthModal from './auth-modal';
import { SignOutButton } from './sign-out-button';

type SessionUser = { name?: string | null; email?: string | null; image?: string | null };

export function ProfileButton({ user }: { user?: SessionUser | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-lg size-12 bg-primary hover:bg-primary/80"
        >
          {user?.image ? (
            <AvatarImage
              src={user.image as string}
              alt={user.name ?? 'User Avatar'}
              className="bg-primary"
            />
          ) : (
            <Image
              src={user?.image || avatar}
              alt={user?.name || 'User Avatar'}
              sizes="100vw"
              style={{
                width: 'auto',
                height: '50%',
              }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 border border-gray-900 ">
        {user ? (
          <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel>Account</DropdownMenuLabel>
        )}

        <DropdownMenuItem>
          <Link href={profileRoute}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {' '}
          <Link href={profileRoute}>Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-900" />
        {user ? (
          <SignOutButton>
            <Button
              variant="ghost"
              className="text-destructive w-full justify-start font-semibold p-2"
            >
              Logout
            </Button>
          </SignOutButton>
        ) : (
          <AuthModal mode="modal" asChild>
            <Button className="font-semibold p-2">Sign In</Button>
          </AuthModal>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
