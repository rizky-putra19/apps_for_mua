import { Injectable } from '@nestjs/common';
import { CacheInterface } from './cache.interface';
import Redis, { Redis as RedisType } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCache implements CacheInterface {
  private redis: RedisType;
  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('redis.host'),
      port: this.configService.get<number>('redis.port'),
    });
  }

  set(key: string, value: any, expiry?: number): void {
    if (expiry) {
      this.redis.setex(key, expiry, value);
      return;
    }
    this.redis.set(key, value);
  }

  get(key: string): Promise<string> {
    return this.redis.get(key);
  }
  remove(key: string): void {
    this.redis.unlink(key);
  }
}
