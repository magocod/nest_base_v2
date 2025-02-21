import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { configAsyncBaseModules, configBaseModules } from '../app.module';
import { CatsModule } from './cats.module';
import mongoose from 'mongoose';
import { CreateCatDto } from './dto';
import { faker } from '@faker-js/faker';
import {
  MongoConnectionService,
  generateOwner,
  generateCat,
  generateCatWith,
} from '../../test/fixtures';
import { PaginationMongoDto } from '../common/dtos';
import { DEFAULT_LIMIT_PAGINATION, PaginationMongoKeys } from '../common/utils';
import {
  basicPagination,
  TESTING_DEFAULT_PAGINATION,
  unreachable,
} from '../../test/helpers';
import { NotFoundException } from '@nestjs/common';

describe('CatsService', () => {
  let service: CatsService;
  let mongoConnectionService: MongoConnectionService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configAsyncBaseModules(),
        ...configBaseModules(),
        CatsModule,
      ],
      // providers: [CatsService],
      providers: [MongoConnectionService],
    }).compile();

    service = module.get<CatsService>(CatsService);
    mongoConnectionService = module.get<MongoConnectionService>(
      MongoConnectionService,
    );
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

    it('with owner', async () => {
      const { owner } = await generateOwner(mongoConnectionService);

      const data: CreateCatDto = {
        name: faker.animal.cat(),
        age: faker.number.int({ min: 1, max: 1000 }),
        breed: faker.string.uuid(),
        isActive: faker.datatype.boolean(),
        owner: owner._id.toString(),
      };
      const cat = await service.create(data);

      expect(cat.id).toBeDefined();
      expect(cat.name).toEqual(data.name);
      expect(cat.age).toEqual(data.age);
      expect(cat.breed).toEqual(data.breed);
      expect(cat.isActive).toEqual(data.isActive);
    });

    it('invalid data', async () => {
      const data = {} as CreateCatDto;
      try {
        await service.create(data);
        unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(mongoose.Error.ValidationError);
      }
    });
  });

  describe('remove', function () {
    it('success', async () => {
      const { cat } = await generateCatWith(mongoConnectionService, {
        owner: false,
        stories: 1,
      });
      const result = await service.remove(cat._id.toString());

      expect(result?._id).toEqual(cat._id);
    });

    it('not found', async () => {
      await generateCatWith(mongoConnectionService, {
        owner: false,
        stories: 1,
      });

      try {
        await service.remove('1'.repeat(24));
        unreachable();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('error id', async () => {
      await generateCatWith(mongoConnectionService, {
        owner: false,
        stories: 1,
      });

      try {
        await service.remove('111');
        unreachable();
      } catch (e) {
        console.log(e);
        // expect(e).toBeInstanceOf();
      }
    });
  });

  describe('findAll', function () {
    it('unfiltered', async () => {
      await generateCat(mongoConnectionService);
      const qs: PaginationMongoDto = {};
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(0);
      expect(pagination.limit).toEqual(DEFAULT_LIMIT_PAGINATION);
    });

    it('paginate', async () => {
      await generateCat(mongoConnectionService);
      const qs = basicPagination();
      qs.limit = TESTING_DEFAULT_PAGINATION;
      qs.skip = 1;
      const pagination = await service.findAll(qs);

      expect(Object.keys(pagination)).toEqual(PaginationMongoKeys);
      expect(pagination.skip).toEqual(qs.skip);
      expect(pagination.limit).toEqual(TESTING_DEFAULT_PAGINATION);
    });

    it('invalid qs', async () => {
      await generateCat(mongoConnectionService);
      const qs = basicPagination();
      qs.limit = 'test';
      qs.skip = null;
      try {
        await service.findAll(qs);
      } catch (e) {
        expect(e).toBeInstanceOf(mongoose.Error.CastError);
      }
    });
  });
});
