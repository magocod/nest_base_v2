import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';

import { UserCreate1664658587799 } from './migration/1664658587799-UserCreate';
import { RoleCreate1664660233196 } from './migration/1664660233196-RoleCreate';
import { PermissionCreate1664660241262 } from './migration/1664660241262-PermissionCreate';
import { UsersRolesCreate1664660368705 } from './migration/1664660368705-UsersRolesCreate';
import { RolesPermissionsCreate1664660378482 } from './migration/1664660378482-RolesPermissionsCreate';
import { NotificationCreate1670110209569 } from './migration/1670110209569-NotificationCreate';
import { TopicCreate1670110209568 } from './migration/1670110209568-TopicCreate';
import { CategoryCreate1676400104445 } from './migration/1676400104445-CategoryCreate';
import { PostCreate1676400110988 } from './migration/1676400110988-PostCreate';
import { PostCategoryView1676401462376 } from './migration/1676401462376-PostCategoryView';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 0,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
  entities: [],
  // remove index, on migration, problem importing files
  // migrations: ['dist/migration/**/*.js'],
  migrations: [
    UserCreate1664658587799,
    RoleCreate1664660233196,
    PermissionCreate1664660241262,
    UsersRolesCreate1664660368705,
    RolesPermissionsCreate1664660378482,
    NotificationCreate1670110209569,
    TopicCreate1670110209568,
    CategoryCreate1676400104445,
    PostCreate1676400110988,
    PostCategoryView1676401462376,
  ],
  // migrations,
  subscribers: [],
});
