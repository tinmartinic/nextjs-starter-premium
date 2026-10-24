'use client';

import { useCurrentRole } from '@/hooks/use-current-role';
import { RoleEnum } from '@/models/types';

import { FormError } from './form-error';

interface AuthGateProps {
  children: React.ReactNode;
  allowedRoles: RoleEnum | RoleEnum[];
}

export const AuthGate = ({ children, allowedRoles }: AuthGateProps) => {
  const role = useCurrentRole();

  const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (role !== undefined && !allowedRolesArray.includes(role)) {
    return <FormError message="You do not have permission to view this content!" />;
  }

  return <>{children}</>;
};
