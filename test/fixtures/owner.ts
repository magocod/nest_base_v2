import { CatDocument, Owner, OwnerDocument } from '../../src/cats/entities';
import { faker } from '@faker-js/faker';
import { generateCat } from './cat';
import { MongoConnectionService } from './db';

export async function generateOwner(
  connectionService: MongoConnectionService,
  withRelationships = {
    cats: 0,
  },
  data?: Partial<Owner>,
) {
  const OwnerModel = connectionService.checkModel<OwnerDocument>(Owner.name);

  const ownerData: Owner = {
    email: faker.internet.email(),
    ...data,
  };

  const owner = await OwnerModel.create(ownerData);

  const cats: CatDocument[] = [];
  for (let i = 0; i < withRelationships.cats; i++) {
    cats.push(await generateCat(connectionService, { owner: owner._id }));
  }

  owner.cats = cats.map((c) => {
    return c._id;
  });
  await owner.save();

  return { owner, cats };
}
