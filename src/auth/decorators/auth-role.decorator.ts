import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { RoleNames } from '../auth.constants';
import { ApiBearerAuth } from '@nestjs/swagger';

export function AuthRole(...roles: RoleNames[]) {
  return applyDecorators(
    ApiBearerAuth(),
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
