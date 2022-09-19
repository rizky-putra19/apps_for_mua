import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomStrategy } from '@src/infrastructure/auth/strategies/custom.strategies';
import { FirebaseClient } from '@src/infrastructure/http/firebase-client.http';
import { MailgunClient } from '@src/infrastructure/http/mailgun.client';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AddAddressHttpController } from './commands/add-address/add-address.http.controller';
import { EditAddressHttpController } from './commands/edit-address/edit-address.http.controller';
import { AddMetadataHttpController } from './commands/add-user-metadata/add-metadata.http.controller';
import { EditMetadataHttpController } from './commands/edit-user-metadata/edit-metadata.http.controller';
import { ProfileController } from './queries/my-profile/profile.http.controller';
import { ProfileQueryHandler } from './queries/my-profile/profile.query-handler';
import { ResendVerificationController } from './queries/resend-verification/resend-verification.http.controller';
import { ResendVerificationQueryHandler } from './queries/resend-verification/resend-verification.query-handler';
import { GetAddressesHttpController } from './queries/get-addresses/get-addresses.http.controller';

@Module({
  imports: [AuthModule, UserModule, HttpModule, CqrsModule],
  controllers: [
    ProfileController,
    ResendVerificationController,
    AddAddressHttpController,
    EditAddressHttpController,
    GetAddressesHttpController,
    AddMetadataHttpController,
    EditMetadataHttpController,
  ],
  providers: [
    CustomStrategy,
    ResendVerificationQueryHandler,
    MailgunClient,
    FirebaseClient,
    ProfileQueryHandler,
  ],
})
export class ProfileModule {}
