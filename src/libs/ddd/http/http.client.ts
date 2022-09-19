import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, Method } from 'axios';
import { firstValueFrom, map } from 'rxjs';

export abstract class HttpClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly baseUrl: string,
  ) {}

  protected operation<T>(
    method: Method,
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return firstValueFrom(
      this.httpService
        .request({
          method,
          baseURL: this.baseUrl,
          url,
          ...config,
        })
        .pipe(
          map((res) => {
            return res.data;
          }),
        ),
    );
  }
}
