import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ExceptionInterceptor } from './infrastructure/interceptors/exception.interceptor';
import { GCPubSubServer } from '@algoan/nestjs-google-pubsub-microservice';
import { ExcludeNullInterceptor } from './infrastructure/interceptors/exclude-null.interceptor';
import { TransformInterceptor } from './infrastructure/interceptors/transformer.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(passport.initialize());
  let credentials = null;
  const saPath = path.resolve('./service_account.json');
  if (fs.existsSync(saPath)) {
    credentials = JSON.parse(fs.readFileSync(saPath).toString());
  }
  const arr = [];

  app.useStaticAssets(path.join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', '..', 'views'));
  app.setViewEngine('hbs');

  function rotate(input) {
    return;
  }
  app.connectMicroservice({
    strategy: new GCPubSubServer({
      projectId: 'beautybellid',
      subscriptionsPrefix: 'API-V2',
      subscriptionsSeparator: '-',
      credentials: credentials,
      topicsNames: [
        `ARTISAN_CREATED_EVENT_${process.env.STAGE.toUpperCase()}`,
        `ARTISAN_UPDATED_EVENT_${process.env.STAGE.toUpperCase()}`,
        `ARTISAN_VERIFIED_UPDATE_${process.env.STAGE.toUpperCase()}`,
        `ARTISAN_EDITOR_CHOICE_UPDATE_${process.env.STAGE.toUpperCase()}`,
        `USER_CREATED_EVENT_${process.env.STAGE.toUpperCase()}`,
        `USER_UPDATED_EVENT_${process.env.STAGE.toUpperCase()}`,
      ],
    }),
  });
  app.setGlobalPrefix('api', {
    exclude: [
      'health',
      'auth/verify',
      'auth/forgot-password',
      'auth',
      'accounts/login',
      'payment/callback/:provider',
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });
  const options = new DocumentBuilder().build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ExceptionInterceptor());
  app.useGlobalInterceptors(new ExcludeNullInterceptor());
  app.enableShutdownHooks();
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
