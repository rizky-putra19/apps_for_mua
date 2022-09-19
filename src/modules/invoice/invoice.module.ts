import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';
import { CreateInvoiceCommandHandler } from './commands/create-invoice/create-invoice.command-handler';
import { CreateInvoiceController } from './commands/create-invoice/create-invoice.http-controller';
import { InvoiceOrmEntity } from './database/invoice.orm-entity';
import { InvoiceRepository } from './database/invoice.repository';
import { createInvoiceEventWhenBookingIsConfirmedEventHandler } from './invoice.provider';

@Module({
  providers: [
    InvoiceRepository,
    CreateInvoiceCommandHandler,
    createInvoiceEventWhenBookingIsConfirmedEventHandler,
  ],
  imports: [
    TypeOrmModule.forFeature([InvoiceOrmEntity]),
    CqrsModule,
    PaymentModule,
  ],
  controllers: [CreateInvoiceController],
})
export class InvoiceModule {}
