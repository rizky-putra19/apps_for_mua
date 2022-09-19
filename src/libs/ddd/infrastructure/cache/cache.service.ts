import { Injectable } from '@nestjs/common';
import { CacheInterface } from './cache.interface';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CacheService {
	constructor(private readonly client: CacheInterface) {}

	set(key: string, value: any, expiry?: number): void {
		this.client.set(key, JSON.stringify(value), expiry);
	}

	async get<T>(key: string, arg: any): Promise<T> {
		const result = await this.client.get(key);
		if (!result) {
			return Promise.resolve(null);
		}
		let jsonData: object;
		if (typeof result === 'string') {
			jsonData = JSON.parse(result);
		} else {
			jsonData = result;
		}
		const classEntity: T = plainToClass(arg, jsonData);
		return Promise.resolve(classEntity);
	}
	remove(key: string): void {
		this.client.remove(key);
	}
}
