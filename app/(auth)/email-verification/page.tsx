import { Suspense } from 'react';
import { BeatLoader } from 'react-spinners';

import EmailVerificationForm from '@/components/auth/forms/email-verification-form';

const EmailVerificationPage = () => {
  return (
    <Suspense fallback={<BeatLoader />}>
      <EmailVerificationForm />
    </Suspense>
  );
};

export default EmailVerificationPage;
