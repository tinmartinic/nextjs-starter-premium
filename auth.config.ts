import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';

import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { deleteTwoFactorConfirmation } from './actions/auth/token';
import { updateUser } from './actions/user';
import { getAccountByUserId } from './data/account';
import { getTwoFactorConfirmationByUserId } from './data/token';
import { getUserByEmail, getUserById } from './data/user';
import { db } from './lib/db/drizzle';
import { LoginFormSchema } from './lib/validations/auth-schema';
import { RoleEnum } from './models/types';

export type AuthUser = DefaultSession['user'] & {
  id: string;
  role: RoleEnum;
  isSubscribed: boolean;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  image: string | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
};

const MAX_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCKOUT_DURATION = 15 * 60 * 1000;

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
}

export const authConfig = {
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginFormSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const now = new Date();
          if (user.lockUntil && user.lockUntil > now) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            await updateUser(user.id, {
              loginAttempts: 0,
              lockUntil: null,
              lastLogin: new Date(),
            });

            return user;
          } else {
            const updatedLoginAttempts = (user.loginAttempts || 0) + 1;

            await updateUser(user.id, {
              loginAttempts: updatedLoginAttempts,
              lockUntil:
                updatedLoginAttempts >= MAX_LOGIN_ATTEMPTS
                  ? new Date(now.getTime() + ACCOUNT_LOCKOUT_DURATION)
                  : null,
            });
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  events: {
    async linkAccount({ user }) {
      await updateUser(user.id as string, {
        emailVerified: new Date(),
        loginAttempts: 0,
        lockUntil: null,
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id as string);

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }

      await updateUser(user.id as string, {
        lastLogin: new Date(),
        loginAttempts: 0,
        lockUntil: null,
      });

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as RoleEnum;
        session.user.isSubscribed = token.isSubscribed as boolean;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = (token.name as string) || null;
        session.user.lastName = (token.lastName as string) || null;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = (token.image as string) || null;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      if (token.exp && Date.now() > token.exp * 1000) {
        return {};
      }

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.lastName = existingUser.lastName;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image;
      token.isSubscribed = existingUser.isSubscribed;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;

export default authConfig;
