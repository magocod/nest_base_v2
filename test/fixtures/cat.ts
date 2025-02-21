import {
  Cat,
  CatDocument,
  Story,
  StoryDocument,
} from '../../src/cats/entities';
import { faker } from '@faker-js/faker';
import { generateOwner } from './owner';
import { MongoConnectionService } from './db';
import mongoose from 'mongoose';

export function generateCat(
  connectionService: MongoConnectionService,
  data?: Partial<Cat>,
) {
  const catModel = connectionService.checkModel<CatDocument>(Cat.name);

  const cat: Cat = {
    name: faker.animal.cat(),
    age: faker.number.int({ min: 1, max: 1000 }),
    breed: faker.string.uuid(),
    isActive: faker.datatype.boolean(),
    tags: faker.helpers.arrayElements(['A', 'B', 'C']),
    ...data,
  };
  return catModel.create(cat);
}

export async function generateCatWith(
  connectionService: MongoConnectionService,
  withRelationships = {
    stories: 0,
    owner: false,
  },
  data?: Partial<Cat>,
) {
  const catModel = connectionService.checkModel<CatDocument>(Cat.name);
  const storyModel = connectionService.checkModel<StoryDocument>(Story.name);

  let owner: mongoose.Types.ObjectId | undefined = undefined;

  if (withRelationships.owner) {
    const ownerPayload = await generateOwner(connectionService);
    owner = ownerPayload.owner._id;
  }

  const catData: Cat = {
    name: faker.animal.cat(),
    age: faker.number.int({ min: 1, max: 1000 }),
    breed: faker.string.uuid(),
    isActive: faker.datatype.boolean(),
    tags: faker.helpers.arrayElements(['A', 'B', 'C']),
    ...data,
    owner,
  };
  const cat = await catModel.create(catData);

  const stories: StoryDocument[] = [];

  for (let i = 0; i < withRelationships.stories; i++) {
    stories.push(
      await storyModel.create({
        text: faker.string.uuid(),
        cat: cat._id,
      }),
    );
  }

  return { cat, stories };
}
