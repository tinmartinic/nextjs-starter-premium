'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import {
  passwordResetToken,
  twoFactorConfirmation,
  twoFactorToken,
  verificationToken,
} from '@/lib/db/schema';
import {
  PasswordResetToken,
  TwoFactorConfirmation,
  TwoFactorToken,
  VerificationToken,
} from '@/models/types';

export const getVerificationTokenByEmail = async (
  email: string,
): Promise<VerificationToken | null> => {
  try {
    const token = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email))
      .execute();

    return token[0] || null;
  } catch (error) {
    console.error('Error fetching VT by ID:', error);
    return null;
  }
};

export const getVerificationTokenByToken = async (
  vT: string,
): Promise<VerificationToken | null> => {
  try {
    const token = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, vT))
      .execute();

    return token[0] || null;
  } catch (error) {
    console.error('Error fetching 2FA by ID:', error);
    return null;
  }
};

export const getPasswordResetTokenByToken = async (
  token: string,
): Promise<PasswordResetToken | null> => {
  try {
    const passwordResetTokenData = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token))
      .execute();

    return passwordResetTokenData.length > 0 ? passwordResetTokenData[0] : null;
  } catch (error) {
    console.error('Error fetching password reset token by token:', error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (
  email: string,
): Promise<PasswordResetToken | null> => {
  try {
    const passwordResetTokenData = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email))
      .execute();

    return passwordResetTokenData.length > 0 ? passwordResetTokenData[0] : null;
  } catch (error) {
    console.error('Error fetching password reset token by email:', error);
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string): Promise<TwoFactorToken | null> => {
  try {
    const twoFactorTokenData = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.token, token))
      .execute();

    return twoFactorTokenData.length > 0 ? twoFactorTokenData[0] : null;
  } catch (error) {
    console.error('Error fetching two-factor token by token:', error);
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string): Promise<TwoFactorToken | null> => {
  try {
    const twoFactorTokenData = await db
      .select()
      .from(twoFactorToken)
      .where(eq(twoFactorToken.email, email))
      .execute();

    return twoFactorTokenData.length > 0 ? twoFactorTokenData[0] : null;
  } catch (error) {
    console.error('Error fetching two-factor token by email:', error);
    return null;
  }
};

export const getTwoFactorConfirmationByUserId = async (
  userId: string,
): Promise<TwoFactorConfirmation | null> => {
  try {
    const twofactorConfirmation = await db
      .select()
      .from(twoFactorConfirmation)
      .where(eq(twoFactorConfirmation.userId, userId))
      .execute();

    return twofactorConfirmation[0] || null;
  } catch (error) {
    console.error('Error fetching 2FA by ID:', error);
    return null;
  }
};
