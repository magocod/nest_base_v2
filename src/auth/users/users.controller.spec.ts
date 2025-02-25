import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { configAsyncBaseModules, configBaseModules, postgresConfig } from '../../app.module';
import { AuthModule } from '../auth.module';

describe('UsersController', () => {
  let controller: UsersController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configAsyncBaseModules(),
        ...configBaseModules(postgresConfig),
        AuthModule,
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
