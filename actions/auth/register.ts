'use server';

import bcrypt from 'bcryptjs';
import * as z from 'zod';

import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema';
import { sendVerificationEmail } from '@/lib/mail';
import { RegisterFormSchema } from '@/lib/validations/auth-schema';

import { generateVerificationToken } from './token';

export const register = async (rawValues: z.infer<typeof RegisterFormSchema>) => {
  const validatedFields = RegisterFormSchema.safeParse(rawValues);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const values = validatedFields.data;

  const hashedPassword = await bcrypt.hash(values.password, 10);

  const existingUser = await getUserByEmail(values.email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.insert(user).values({
    name: values?.name,
    lastName: values?.lastName,
    email: values?.email,
    password: hashedPassword,
  });

  const verificationToken = await generateVerificationToken(values.email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Please verify the Email!' };
};
