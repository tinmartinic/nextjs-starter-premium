'use server';

import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import {
  getPasswordResetTokenByEmail,
  getTwoFactorTokenByEmail,
  getVerificationTokenByEmail,
} from '@/data/token';
import { db } from '@/lib/db/drizzle';
import {
  passwordResetToken,
  twoFactorConfirmation,
  twoFactorToken,
  verificationToken,
} from '@/lib/db/schema';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationToken(existingToken.token);
  }

  const newVerificationToken = await db
    .insert(verificationToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return newVerificationToken[0];
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetToken(existingToken.id);
  }

  const newPasswordResetToken = await db
    .insert(passwordResetToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return newPasswordResetToken[0];
};

export const generateTwoFactorToken = async (email: string) => {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await deleteTwoFactorToken(existingToken.id);
  }

  const newTwoFactorToken = await db
    .insert(twoFactorToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return newTwoFactorToken[0];
};

export async function deleteVerificationToken(token: string): Promise<void> {
  try {
    await db.delete(verificationToken).where(eq(verificationToken.token, token));

    console.log(`Verification token ${token} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting verification token:', error);
    throw new Error('Could not delete verification token: ' + token);
  }
}

export async function deleteTwoFactorToken(id: string): Promise<void> {
  try {
    await db.delete(twoFactorToken).where(eq(twoFactorToken.id, id));

    console.log(`Two-factor token ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting two-factor token:', error);
    throw new Error('Could not delete two-factor token: ' + id);
  }
}

export async function deletePasswordResetToken(id: string): Promise<void> {
  try {
    await db.delete(passwordResetToken).where(eq(passwordResetToken.id, id));

    console.log(`Password reset token ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting Password reset token:', error);
    throw new Error('Could not delete Password reset token: ' + id);
  }
}

export async function deleteTwoFactorConfirmation(twoFactorConfirmationId: string): Promise<void> {
  try {
    await db
      .delete(twoFactorConfirmation)
      .where(eq(twoFactorConfirmation.id, twoFactorConfirmationId));

    console.log(`Two-factor confirmation with ID ${twoFactorConfirmationId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting two-factor confirmation:', error);
    throw new Error('Could not delete two-factor confirmation');
  }
}
