import { Suspense } from 'react';

import { AuthTabs } from '@/components/auth/ui/auth-tabs';
import MaxWidthWrapper from '@/components/global/max-width-wrapper';

import AuthErrorPage from '../error/page';

const AuthPage = () => {
  return (
    <Suspense fallback={<AuthErrorPage />}>
      <MaxWidthWrapper>
        <div className="flex justify-center items-center min-h-screen">
          <AuthTabs />
        </div>
      </MaxWidthWrapper>
    </Suspense>
  );
};

export default AuthPage;
