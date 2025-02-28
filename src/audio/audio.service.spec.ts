import { Test, TestingModule } from '@nestjs/testing';
import { AudioService } from './audio.service';
import { configBaseModules, redisConfig } from '../app.module';
import { AudioModule } from './audio.module';

describe('AudioService', () => {
  let service: AudioService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(redisConfig), AudioModule],
      providers: [AudioService],
    }).compile();

    service = module.get<AudioService>(AudioService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
