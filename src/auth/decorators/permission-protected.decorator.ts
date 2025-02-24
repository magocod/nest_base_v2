import { SetMetadata } from '@nestjs/common';
import { PermissionNames } from '../auth.constants';

export const META_PERMISSION = 'permission';

export const PermissionProtected = (...args: PermissionNames[]) => {
  return SetMetadata(META_PERMISSION, args);
};
