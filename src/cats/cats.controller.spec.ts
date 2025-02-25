import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';
import { configAsyncBaseModules, configBaseModules } from '../app.module';
import { CatsModule } from './cats.module';

describe('CatsController', () => {
  let controller: CatsController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configAsyncBaseModules(),
        ...configBaseModules(),
        CatsModule,
      ],
      controllers: [CatsController],
      // providers: [CatsService],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  afterAll(async () => {
    await module.close();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
