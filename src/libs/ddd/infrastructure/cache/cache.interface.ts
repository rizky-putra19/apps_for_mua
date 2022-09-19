export interface CacheInterface {
	set(key: string, value: any, expiry?: number): void;
	get(key: string): Promise<string>;
	remove(key: string): void;
}
