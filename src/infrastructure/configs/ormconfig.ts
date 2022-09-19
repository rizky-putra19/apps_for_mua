import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  autoLoadEntities: true,
  synchronize: false, //process.env.NODE_ENV == 'dev',
  logging: ['error', 'migration', 'schema'],
  keepConnectionAlive: true,
  cache: {
    duration: 3000,
    type: 'ioredis',
    options: {
      host: 'localhost',
      port: 63790,
    },
  },
};
