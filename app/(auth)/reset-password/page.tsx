import { Suspense } from 'react';
import { BeatLoader } from 'react-spinners';

import ResetPasswordForm from '@/components/auth/forms/reset-password-form';

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<BeatLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPasswordPage;
