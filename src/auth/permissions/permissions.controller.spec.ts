import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { configBaseModules, postgresConfig } from '../../app.module';
import { AuthModule } from '../auth.module';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(postgresConfig), AuthModule],
      controllers: [PermissionsController],
      providers: [PermissionsService],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
  });

  afterAll(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
