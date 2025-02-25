import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { RegisterUserDto, LoginUserDto } from './dto';
import { User } from './users/entities';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { configBaseModules, postgresConfig } from '../app.module';
import {
  CREDENTIALS_INVALID_EMAIL,
  CREDENTIALS_INVALID_PASSWORD,
} from './auth.messages';

import { generateUser, generatePassword } from '../../test/fixtures';
import { DataSource } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  let dataSource: DataSource;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(postgresConfig), AuthModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('create', function () {
    it('create user successfully', async () => {
      const data = {
        email: faker.internet.email(),
        password: generatePassword(),
        fullName: faker.person.fullName(),
      };
      const payload = await service.create(data);

      expect(Object.keys(payload).sort()).toEqual(
        expect.arrayContaining(['token']),
      );
      expect(payload.email).toEqual(data.email.toLowerCase());
      expect(payload.password).toBeUndefined();
      expect(payload.fullName).toEqual(data.fullName);
    });

    it('duplicate mail error', async () => {
      const { user } = await generateUser(dataSource);
      const data = {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      };

      try {
        await service.create(data);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('invalid data error', async () => {
      const data = {} as RegisterUserDto;

      try {
        await service.create(data);
      } catch (e) {
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('login', function () {
    it('valid credentials', async () => {
      const { user, password } = await generateUser(dataSource);
      const data = {
        email: user.email,
        password,
      };

      const payload = await service.login(data);
      expect(payload.token).toBeDefined();
      expect(payload.id).toEqual(user.id);
    });

    it('invalid credentials - password', async () => {
      const { user } = await generateUser(dataSource);
      const data = {
        email: user.email,
        password: faker.string.uuid(),
      };

      try {
        await service.login(data);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        if (e instanceof UnauthorizedException) {
          expect(e.message).toEqual(CREDENTIALS_INVALID_PASSWORD);
        }
      }
    });

    it('invalid credentials - email', async () => {
      const { password } = await generateUser(dataSource);
      const data = {
        email: 'notexist@domain.com',
        password,
      };

      try {
        await service.login(data);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        if (e instanceof UnauthorizedException) {
          expect(e.message).toEqual(CREDENTIALS_INVALID_EMAIL);
        }
      }
    });

    it('invalid function parameters', async () => {
      const data = {} as LoginUserDto;

      try {
        await service.login(data);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('checkAuthStatus', function () {
    it('valid user', async () => {
      const { user } = await generateUser(dataSource);

      const payload = service.checkAuthStatus(user);
      expect(payload.token).toBeDefined();
      expect(payload.id).toEqual(user.id);
    });

    it('invalid function parameters', () => {
      const data = {} as User;

      const payload = service.checkAuthStatus(data);
      expect(payload.id).toBeUndefined();
    });
  });
});
