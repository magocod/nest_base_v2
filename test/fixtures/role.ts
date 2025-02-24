import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

import { Role } from '../../src/auth/roles/entities';
import { Permission } from '../../src/auth/permissions/entities';

export async function generateRole(ds: DataSource, data?: Partial<Role>) {
  const roleRep = ds.getRepository(Role);

  let role = roleRep.create({
    name: faker.string.uuid(),
    description: faker.string.uuid(),
    ...data,
  });
  role = await roleRep.save(role);

  return role;
}

// ???
export async function generateRoleWith(
  ds: DataSource,
  permissions: Permission[],
) {
  const role = await generateRole(ds, {
    permissions,
  });

  // ...

  return role;
}
