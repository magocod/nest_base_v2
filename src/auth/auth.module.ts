import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { PermissionsController } from './permissions/permissions.controller';
import { PermissionsService } from './permissions/permissions.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities';
import { Role } from './roles/entities';
import { Permission } from './permissions/entities';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  controllers: [
    AuthController,
    UsersController,
    RolesController,
    PermissionsController,
  ],
  providers: [
    AuthService,
    UsersService,
    RolesService,
    PermissionsService,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    UsersService,
  ],
})
export class AuthModule {}
