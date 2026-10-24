'use server';

import { getVerificationTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';

import { updateUser } from '../user';
import { deleteVerificationToken } from './token';

export const emailVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token does not exist or has already been confirmed!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  await updateUser(existingUser.id, { emailVerified: new Date(), email: existingToken.email });

  await deleteVerificationToken(existingToken.token);

  return { success: 'Email verified!' };
};
