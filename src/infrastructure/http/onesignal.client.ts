import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeviceEntity } from '@src/modules/device/domain/entities/device.entity';
import * as OneSignal from '@onesignal/node-onesignal';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { Player } from '@onesignal/node-onesignal';

@Injectable()
export class OneSignalClient {
  private client: OneSignal.DefaultApi;
  private logger: Logger;
  constructor(private readonly configService: ConfigService) {
    const config = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: {
            getToken: () =>
              configService.get('notification.providers.onesignal.appKey'),
          },
        },
      },
    });
    this.client = new OneSignal.DefaultApi(config);
    this.logger = new Logger('OneSignalClient');
  }

  async createOrUpdateDevice(deviceEntity: DeviceEntity) {
    const props = deviceEntity.getPropsCopy();
    const userProps = props.user?.getPropsCopy();
    try {
      const params: Player = {
        device_os: props.platform,
        identifier: props.pushToken,
        external_user_id: userProps?.id.value,
        app_id: this.getAppIdByType(props.type),
        device_type: this.getDeviceType(props.platform),
        id: null,
      };
      this.logger.debug(`[SendingDevice] ${props.deviceId} to onesignal`);
      const res = await this.client.createPlayer(params);
      this.logger.debug(`[SendingDevice] ${props.deviceId} result success`);
      return deviceEntity;
    } catch (err) {
      this.logger.error(err.message, err);
      this.logger.debug(
        `[SendingDevice] ${props.deviceId} has failed: ${err.message}`,
      );
    }
  }

  getDeviceType(platform: string) {
    switch (platform.toLowerCase()) {
      case 'ios':
        return 0;
      case 'android':
        return 1;
      case 'web':
      default:
        return 5;
    }
  }

  getAppIdByType(userType: UserType) {
    if (userType == UserType.ARTISAN) {
      return this.configService.get(
        'notification.providers.onesignal.appId.artisan',
      );
    } else if (userType == UserType.CUSTOMER) {
      return this.configService.get(
        'notification.providers.onesignal.appId.customer',
      );
    }
  }
}
