import { Suspense } from 'react';
import { BeatLoader } from 'react-spinners';

import NewPasswordForm from '@/components/auth/forms/new-password-form';

const NewPasswordPage = () => {
  return (
    <Suspense fallback={<BeatLoader />}>
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPasswordPage;
