import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from './http.client';

@Injectable()
export class FacebookClient extends HttpClient {
  constructor(
    service: HttpService,
    private readonly configService: ConfigService,
  ) {
    super(service, configService.get('http.facebook.baseUrl'));
  }

  async getUserInfo(code: string) {
    const result = this.operation<{ [key: string]: string }>(
      'GET',
      `${this.configService.get('http.facebook.version')}/me`,
      {
        params: {
          access_token: code,
          fields: 'id,name,email,picture.width(1000)',
        },
      },
    );
    return result;
  }
}
