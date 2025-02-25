import { NestFactory } from '@nestjs/core';
import { AppModule, configApp } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { loggerMiddleware } from './common/middleware';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  configApp(app);

  const config = new DocumentBuilder()
    .setTitle('nest_base API')
    .setDescription('nest_base endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      // 'JWT-auth'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (JSON.parse(process.env.LOG_HTTP_REQUEST)) {
    const reqLogger = new Logger('HTTP');
    app.use(loggerMiddleware(reqLogger));
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await app.listen(process.env.PORT);

  logger.log(`App running on http://localhost:${process.env.PORT}/api`);
}
void bootstrap();
