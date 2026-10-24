'use server';

import { currentRole } from '@/lib/auth';
import { RoleEnum } from '@/models/types';

export const admin = async () => {
  const role = await currentRole();

  if (role === RoleEnum.ADMIN) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};

export const moderator = async () => {
  const role = await currentRole();

  if (role === RoleEnum.MODERATOR || role === RoleEnum.ADMIN) {
    return { success: 'Allowed Server Action!' };
  }

  return { error: 'Forbidden Server Action!' };
};
