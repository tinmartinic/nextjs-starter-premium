import { AuthGate } from '@/components/auth/ui/authentication-gate';
import { RoleEnum } from '@/models/types';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGate allowedRoles={RoleEnum.ADMIN}>
      <main className="grid flex-1 items-start lg:gap-2 lg:p-4 pt-4 sm:px-6 md:gap-4">
        {children}
      </main>
    </AuthGate>
  );
};

export default DashboardLayout;
