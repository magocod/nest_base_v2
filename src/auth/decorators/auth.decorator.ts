import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserPermissionGuard } from '../guards/user-permission.guard';
import { PermissionProtected } from './permission-protected.decorator';
import { PermissionNames } from '../auth.constants';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth(...permissions: PermissionNames[]) {
  return applyDecorators(
    ApiBearerAuth(),
    PermissionProtected(...permissions),
    UseGuards(AuthGuard(), UserPermissionGuard),
  );
}
