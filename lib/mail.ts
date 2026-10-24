import { Resend } from 'resend';

import { EmailTemplate } from '@/components/global/email-template';
import { emailVerificationRoute, newPasswordRoute } from '@/routes';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_BASE_URL;
const sender = process.env.NEXT_PUBLIC_EMAIL_SENDER!;
const receiver = process.env.NEXT_PUBLIC_EMAIL_RECEIVER!;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}${newPasswordRoute}?token=${token}`;

  await resend.emails.send({
    from: sender as string,
    to: receiver as string,
    subject: 'Reset your password',
    react: EmailTemplate({ confirmationLink: resetLink }) as React.ReactElement,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}${emailVerificationRoute}?token=${token}`;

  await resend.emails.send({
    from: sender as string,
    to: receiver as string,
    subject: 'Confirm your email',
    react: EmailTemplate({ confirmationLink }) as React.ReactElement,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: sender as string,
    to: receiver as string,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};
