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
import { UsersModule } from './users/users.module';
import { CatsModule } from './cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';

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
    // TODO
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
    UsersModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
