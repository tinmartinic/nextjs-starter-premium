import * as z from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\W).*$/;

const NameSchema = z.string().min(2, 'First Name is required');
const LastNameSchema = z.string().min(2, 'Last Name is required');
const EmailSchema = z
  .string()
  .email({ message: 'Invalid Email Address' })
  .min(5, 'Email must be at least 5 characters long');
const PasswordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .regex(passwordRegex, {
    message:
      'Password must have at least 1 capital letter, 1 lowercase letter, and 1 special character',
  });
const ConfirmPasswordSchema = z
  .string()
  .min(6, { message: 'Confirm password must be at least 6 characters long' });

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const RegisterFormSchema = z
  .object({
    name: NameSchema,
    lastName: LastNameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const ResetPasswordFormSchema = z.object({
  email: EmailSchema,
});

export const NewPasswordFormSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
