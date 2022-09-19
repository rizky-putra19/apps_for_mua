import { TypeormUnitOfWork } from '@src/libs/ddd/infrastructure/database/base-classes/typeorm-unit-of-work';
import { AdminOrmEntity } from '@src/modules/admin/database/admin.orm-entity';
import { AdminRepository } from '@src/modules/admin/database/admin.repository';
import { BookingStatusHistoryOrmEntity } from '@src/modules/booking/database/booking-status-history.orm-entity';
import { BookingStatusOrmEntity } from '@src/modules/booking/database/booking-status.orm-entity';

import { BookingOrmEntity } from '@src/modules/booking/database/booking.orm-entity';
import { BookingRepository } from '@src/modules/booking/database/booking.repository';
import { CategoryOrmEntity } from '@src/modules/category/database/category.orm-entity';
import { CategoryRepository } from '@src/modules/category/database/category.repository';
import { DeviceOrmEntity } from '@src/modules/device/database/device.orm-entity';
import { DeviceRepository } from '@src/modules/device/database/device.repository';
import { EventOrmEntity } from '@src/modules/event/database/event.orm-entity';
import { EventRepository } from '@src/modules/event/database/event.repository';
import { FavoriteOrmEntity } from '@src/modules/favorite/database/favorite.orm-entity';
import { InvoiceOrmEntity } from '@src/modules/invoice/database/invoice.orm-entity';
import { InvoiceRepository } from '@src/modules/invoice/database/invoice.repository';

import { MediaOrmEntity } from '@src/modules/media/database/media.orm-entity';
import { MediaRepository } from '@src/modules/media/database/media.repository';
import { OtpOrmEntity } from '@src/modules/otp/database/otp.orm-entity';
import { OtpRepository } from '@src/modules/otp/database/otp.repository';
import { PaymentOrmEntity } from '@src/modules/payment/database/payment.orm-entity';
import { PaymentRepository } from '@src/modules/payment/database/payment.repository';
import { ReviewOrmEntity } from '@src/modules/review/database/review.orm-entity';
import { ReviewRepository } from '@src/modules/review/database/review.repository';
import { ServiceOrmEntity } from '@src/modules/service/database/service.orm-entity';
import { ServiceRepository } from '@src/modules/service/database/service.repository';
import { UserMetadataOrmEntity } from '@src/modules/user/database/user-metadata.orm-entity';
import { UserOrmEntity } from '@src/modules/user/database/user.orm-entity';
import { UserRepository } from '@src/modules/user/database/user.repository';

export class UnitOfWork extends TypeormUnitOfWork {
  getUserRepository(correlationId: string): UserRepository {
    return new UserRepository(
      this.getOrmRepository(UserOrmEntity, correlationId),
      this.getMediaRepository(correlationId),
      this.getOrmRepository(UserMetadataOrmEntity, correlationId),
      this.getOrmRepository(ReviewOrmEntity, correlationId),
      this.getOrmRepository(BookingOrmEntity, correlationId),
      this.getOrmRepository(FavoriteOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }

  getBookingRepository(correlationId: string): BookingRepository {
    return new BookingRepository(
      this.getOrmRepository(BookingOrmEntity, correlationId),
      this.getUserRepository(correlationId),
      this.getOrmRepository(BookingStatusOrmEntity, correlationId),
      this.getOrmRepository(BookingStatusHistoryOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }

  getPaymentRepository(correlationId: string): PaymentRepository {
    return new PaymentRepository(
      this.getOrmRepository(PaymentOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }

  getInvoiceRepository(correlationId: string): InvoiceRepository {
    return new InvoiceRepository(
      this.getOrmRepository(InvoiceOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }

  getMediaRepository(correllationId: string): MediaRepository {
    return new MediaRepository(
      this.getOrmRepository(MediaOrmEntity, correllationId),
    ).setCorrelationId(correllationId);
  }

  getAdminRepository(correlationId: string): AdminRepository {
    return new AdminRepository(
      this.getOrmRepository(AdminOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }
  getServiceRepository(correlationId: string): ServiceRepository {
    return new ServiceRepository(
      this.getOrmRepository(ServiceOrmEntity, correlationId),
      this.getUserRepository(correlationId),
      this.getMediaRepository(correlationId),
      this.getCategoryRepository(correlationId),
    ).setCorrelationId(correlationId);
  }
  getCategoryRepository(correlationId: string): CategoryRepository {
    return new CategoryRepository(
      this.getOrmRepository(CategoryOrmEntity, correlationId),
      this.getMediaRepository(correlationId),
    );
  }
  getOtpRepository(correlationId: string): OtpRepository {
    return new OtpRepository(
      this.getOrmRepository(OtpOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }
  getDeviceRepository(correlationId: string): DeviceRepository {
    return new DeviceRepository(
      this.getOrmRepository(DeviceOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }

  getEventRepository(correlationId: string): EventRepository {
    return new EventRepository(
      this.getOrmRepository(EventOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }
}
