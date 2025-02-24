import {
  DynamicModule,
  INestApplication,
  Module,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';
import { CommonModule } from './common/common.module';
import { CatsModule } from './cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ViewsModule } from './views/views.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// default config
export const commonConfig = {
  postgres: true,
  mongodb: true,
  websocket: true,
  mysql: true,
  rabbitmq: true,
};

// without db
export const withoutDbConfig = {
  ...commonConfig,
  mongodb: false,
  postgres: false,
  mysql: false,
  rabbitmq: false,
};

// only postgresql
export const postgresConfig = {
  ...commonConfig,
  mongodb: false,
  websocket: false,
  mysql: false,
  rabbitmq: false,
};

// only mongodb
export const mongoConfig = {
  ...commonConfig,
  postgres: false,
  websocket: false,
  mysql: false,
  rabbitmq: false,
};

// only mysql
export const mysqlConfig = {
  ...commonConfig,
  postgres: false,
  websocket: false,
  mongodb: false,
  rabbitmq: false,
};

export const rabbitmqConfig = {
  ...commonConfig,
  postgres: false,
  websocket: false,
  mongodb: false,
  mysql: false,
};

export function configAsyncBaseModules() {
  // ...

  return [
    ConfigModule.forRoot({
      load: [EnvConfiguration],

      validationSchema: JoiValidationSchema,
    }),
  ];
}

export function configBaseModules(config = commonConfig) {
  const modules: DynamicModule[] = [];

  if (config.postgres) {
    modules.push(
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? +process.env.DB_PORT : 0,
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        // logging: false,
        // synchronize: false, // only for quick tests
        // entities: [User, Role, Permission, Notification],
        autoLoadEntities: true,
        // example generate -> typeorm migration:create ./src/migration/UserCreate
        // migrations: ['dist/migration/**/*.js'],
        // migrations: [UserCreate1664658587799],
      }),
    );
  }

  if (config.mongodb) {
    const uri = process.env.MONGO_URL ? process.env.MONGO_URL : '';
    modules.push(MongooseModule.forRoot(uri));
  }

  if (config.websocket) {
    // TODO
  }

  if (config.mysql) {
    // TODO
  }

  if (config.rabbitmq) {
    // TODO
  }

  return modules;
}

export const globalPrefix = 'api';

export function configApp(app: INestApplication) {
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
}

@Module({
  imports: [
    ...configAsyncBaseModules(),
    ...configBaseModules(),
    CommonModule,
    CatsModule,
    AuthModule,
    ViewsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
