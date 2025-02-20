import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { configAsyncBaseModules, configBaseModules } from '../app.module';
import { CatsModule } from './cats.module';
import mongoose from 'mongoose';
import { CreateCatDto } from './dto';
import { faker } from '@faker-js/faker';

describe('CatsService', () => {
  let service: CatsService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configAsyncBaseModules(),
        ...configBaseModules(),
        CatsModule
      ],
      // providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('create', function () {
    it('only required data', async () => {
      const data: CreateCatDto = {
        name: faker.animal.cat(),
        age: faker.number.int({ min: 1, max: 1000 }),
        breed: faker.string.uuid(),
      };
      const cat = await service.create(data);

      expect(cat.id).toBeDefined();
      expect(cat.name).toEqual(data.name);
      expect(cat.age).toEqual(data.age);
      expect(cat.breed).toEqual(data.breed);
    });

    it('with optional data', async () => {
      const data: CreateCatDto = {
        name: faker.animal.cat(),
        age: faker.number.int({ min: 1, max: 1000 }),
        breed: faker.string.uuid(),
        isActive: faker.datatype.boolean(),
      };
      const cat = await service.create(data);

      expect(cat.id).toBeDefined();
      expect(cat.name).toEqual(data.name);
      expect(cat.age).toEqual(data.age);
      expect(cat.breed).toEqual(data.breed);
      expect(cat.isActive).toEqual(data.isActive);
    });

    // it('with owner', async () => {
    //   const { owner } = await generateOwner(service.getConnection());
    //
    //   const data: CreateCatDto = {
    //     name: faker.animal.cat(),
    //     age: faker.datatype.number({ min: 1, max: 1000 }),
    //     breed: faker.datatype.uuid(),
    //     isActive: faker.datatype.boolean(),
    //     owner: owner._id.toString(),
    //   };
    //   const cat = await service.create(data);
    //
    //   expect(cat.id).toBeDefined();
    //   expect(cat.name).toEqual(data.name);
    //   expect(cat.age).toEqual(data.age);
    //   expect(cat.breed).toEqual(data.breed);
    //   expect(cat.isActive).toEqual(data.isActive);
    // });

    it('invalid data', async () => {
      const data = {} as CreateCatDto;
      try {
        await service.create(data);
      } catch (e) {
        expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
      }
    });
  });
});
