import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GCPubSubServer } from '@algoan/nestjs-google-pubsub-microservice';
import { GCListenOptions, GooglePubSubOptions } from '@algoan/pubsub';

async function bootstrap() {
  const options: GooglePubSubOptions & GCListenOptions = {};
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new GCPubSubServer({
        projectId: 'beautybellid',
        subscriptionsPrefix: 'API-V2',
        subscriptionsSeparator: '-',
        topicsNames: [
          `ARTISAN_CREATED_EVENT_${process.env.STAGE.toUpperCase()}`,
          `ARTISAN_UPDATED_EVENT_${process.env.STAGE.toUpperCase()}`,
          `ARTISAN_VERIFIED_UPDATE_${process.env.STAGE.toUpperCase()}`,
          `ARTISAN_EDITOR_CHOICE_UPDATE_${process.env.STAGE.toUpperCase()}`,
          `USER_CREATED_EVENT_${process.env.STAGE.toUpperCase()}`,
          `USER_UPDATED_EVENT_${process.env.STAGE.toUpperCase()}`,
        ],
      }),
    },
  );
  await app.listen();
  console.log('Server running!');
}

bootstrap();
