'use server';

import bcrypt from 'bcryptjs';
import * as z from 'zod';

import { getPasswordResetTokenByEmail, getPasswordResetTokenByToken } from '@/data/token';
import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { NewPasswordFormSchema, ResetPasswordFormSchema } from '@/lib/validations/auth-schema';

import { updateUser } from '../user';
import { deletePasswordResetToken, generatePasswordResetToken } from './token';

export const resetPassword = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
  const validatedFields = ResetPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid email!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const passwordResetToken = await getPasswordResetTokenByEmail(email);

  if (passwordResetToken) {
    const hasExpired = new Date(passwordResetToken.expires) < new Date();
    if (!hasExpired) {
      return { error: 'Reset email already sent!' };
    }
  }
  const newPasswordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(newPasswordResetToken.email, newPasswordResetToken.token);

  return { success: 'Reset email sent!' };
};

export const newPassword = async (
  values: z.infer<typeof NewPasswordFormSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: 'Missing token!' };
  }

  const validatedFields = NewPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: 'Invalid token!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email does not exist!' };
  }

  const passwordMatch =
    existingUser.password && (await bcrypt.compare(password, existingUser.password));

  if (passwordMatch) {
    return { error: 'Password must be different from current password!' };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUser(existingUser.id, { password: hashedPassword });
  await deletePasswordResetToken(existingToken.id);

  return { success: 'Password updated!' };
};
