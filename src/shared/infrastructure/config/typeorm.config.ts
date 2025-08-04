/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';

import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const typeOrmConfig = (conf: ConfigService): any => {
  const nodeEnv = conf.get('NODE_ENV') || 'development';

  let host, username, password, database, port;

  if (nodeEnv === 'test') {
    host = conf.get('TEST_DB_HOST');
    username = conf.get('TEST_DB_USERNAME');
    password = conf.get('TEST_DB_PASSWORD');
    database = conf.get('TEST_DB_NAME');
    port = conf.get<number>('TEST_DB_PORT') || conf.get<number>('DB_PORT');
  } else if (nodeEnv === 'development') {
    host = conf.get('DEV_DB_HOST') || conf.get('DB_HOST');
    username = conf.get('DEV_DB_USERNAME') || conf.get('DB_USERNAME');
    password = conf.get('DEV_DB_PASSWORD') || conf.get('DB_PASSWORD');
    database = conf.get('DEV_DB_NAME') || conf.get('DB_NAME');
    port = conf.get<number>('DEV_DB_PORT') || conf.get<number>('DB_PORT');
  } else {
    host = conf.get('DB_HOST');
    username = conf.get('DB_USERNAME');
    password = conf.get('DB_PASSWORD');
    database = conf.get('DB_NAME');
    port = conf.get<number>('DB_PORT');
  }

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    schema: 'public',
    synchronize: false,
    migrationsTableName: 'migrations',
    migrations: [
      `${__dirname}/../../../**/infrastructure/database/migrations/*.ts`,
    ],
    cli: {
      migrationsDir: 'src/shared/infrastructure/database/migrations',
    },
  };
};

const configService = new ConfigService();

export default new DataSource({
  ...typeOrmConfig(configService),
  subscribers: [
    `${__dirname}/../../../**/infrastructure/database/subscribers/**/*.subscriber{.ts,.js}`,
  ],
  entities: [
    `${__dirname}/../../../**/infrastructure/database/entities/**/*.entity{.ts,.js}`,
  ],
});
