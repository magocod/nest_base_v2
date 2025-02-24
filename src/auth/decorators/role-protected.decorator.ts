import { SetMetadata } from '@nestjs/common';
import { RoleNames } from '../auth.constants';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: RoleNames[]) => {
  return SetMetadata(META_ROLES, args);
};
