'use client';

import { useSearchParams } from 'next/navigation';

import { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

import { emailVerification } from '@/actions/auth/email';
import { loginRoute } from '@/routes';

import AuthCard from '../ui/auth-card';
import { FormError } from '../ui/form-error';
import { FormSuccess } from '../ui/form-success';

const EmailVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [tokenVerified, setTokenVerified] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (success || error || tokenVerified) return;

    if (!token) {
      setError('Missing token!');
      return;
    }

    emailVerification(token)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          setTokenVerified(true);
        } else {
          setError(data.error);
        }
      })
      .catch(() => {
        setError('Something went wrong!');
      });
  }, [token, success, error, tokenVerified]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthCard
      headerLabel="Confirming your verification"
      buttonLabel="Back to login"
      buttonHref={loginRoute}
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </AuthCard>
  );
};

export default EmailVerificationForm;
