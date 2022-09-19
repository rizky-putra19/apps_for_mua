import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { typeOrmConfig } from './infrastructure/configs/ormconfig';
import { UnitOfWorkModule } from './infrastructure/database/unit-of-work/unit-of-work.module';

import { UserModule } from './modules/user/user.module';
import { ConsoleModule } from 'nestjs-console';
import { SearchModule } from './modules/search/search.module';
import { BookingModule } from './modules/booking/booking.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from './infrastructure/http/http.module';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';
import { AppLoggerMiddleware } from './infrastructure/middlewares/app-logger.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './infrastructure/interceptors/transformer.interceptor';
import { MailgunClient } from './infrastructure/http/mailgun.client';
import { ProfileModule } from './modules/profile/profile.module';
import { MediaModule } from './modules/media/media.module';
import { CategoryModule } from './modules/category/category.module';
import { ServiceModule } from './modules/service/service.module';
import { ReasonModule } from './modules/reasons/reason.module';
import { OtpModule } from './modules/otp/otp.module';
import configuration from './infrastructure/configs/configuration';
import { OrmConfigService } from './infrastructure/configs/db.config';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { ReviewModule } from './modules/review/review.module';
import { PaymentModule } from './modules/payment/payment.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { DeviceModule } from './modules/device/device.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { GeoLocationModule } from './modules/geo-location/geo-location.module';
import { EventModule } from './modules/event/event.module';
import { EditorChoiceModule } from './modules/editor-choice/editor-choice.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ReportIssueModule } from './modules/report-issue/report-issue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      useClass: OrmConfigService,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    PassportModule,
    UserModule,
    UnitOfWorkModule,
    ConsoleModule,
    SearchModule,
    BookingModule,
    HttpModule,
    HealthcheckModule,
    MediaModule,
    CqrsModule,
    AuthModule,
    ProfileModule,
    // AdminModule,
    OtpModule,
    CategoryModule,
    ReasonModule,
    ServiceModule,
    FavoriteModule,
    ReviewModule,
    PaymentModule,
    InvoiceModule,
    DeviceModule,
    WalletModule,
    GeoLocationModule,
    EventModule,
    EditorChoiceModule,
    FinanceModule,
    ReportIssueModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },

    MailgunClient,
  ],
  exports: [MailgunClient],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
