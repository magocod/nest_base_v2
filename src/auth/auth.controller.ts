import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { Auth, GetUser, PermissionProtected, RawHeaders } from './decorators';

import { RegisterUserDto, LoginUserDto, RecoveryPasswordDto } from './dto';
import { User } from './users/entities';

import { UserPermissionGuard } from './guards';
import { PermissionNames } from './auth.constants';
import { ApiVersion } from '../app.constants';

@ApiTags('Auth')
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
@Controller({ path: 'auth', version: ApiVersion.v1 })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.create(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @PermissionProtected(PermissionNames.EXAMPLE, PermissionNames.USER)
  @UseGuards(AuthGuard(), UserPermissionGuard)
  @ApiBearerAuth()
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(PermissionNames.EXAMPLE)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Post('email_recovery_password')
  sendEmailRecoverPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.authService.sendEmailRecoverPassword(recoveryPasswordDto);
  }
}
