import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../users/entities';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as User;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return !data ? user : user[data];
  },
);
