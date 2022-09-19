import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserType } from '@src/modules/user/domain/enums/user-type.enum';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';

@Injectable()
export class FirebaseClient {
  private webApiKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.webApiKey = this.configService.get('firebaseWebApiKey');
  }

  async generateShortlink(link: string, userType: UserType) {
    const body = {
      dynamicLinkInfo: {
        domainUriPrefix: this.configService.get(
          `${userType}FirebaseDynamicLinkPrefix`,
        ),
        link,
        androidInfo: {
          androidPackageName: this.getAndroidPackageByType(userType),
        },
        iosInfo: { iosBundleId: this.getIosPackageByType(userType) },
      },
    };
    const result = await firstValueFrom(
      this.httpService
        .post(
          `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${this.webApiKey}`,
          body,
        )
        .pipe(
          catchError((err) => {
            console.log(err);
            return throwError(() => err);
          }),
        )
        .pipe(map((res) => res.data.shortLink)),
    );
    return result;
  }

  getAndroidPackageByType(userType: UserType) {
    return this.configService.get(`${userType}AndroidPackageName`);
  }
  getIosPackageByType(userType: UserType) {
    return this.configService.get(`${userType}AndroidPackageName`);
  }
}
