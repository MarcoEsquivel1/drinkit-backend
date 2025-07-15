import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get('NODE_ENV');

  let host, username, password, database;

  if (nodeEnv === 'test') {
    host = configService.get('TEST_DB_HOST');
    username = configService.get('TEST_DB_USERNAME');
    password = configService.get('TEST_DB_PASSWORD');
    database = configService.get('TEST_DB_NAME');
  } else if (nodeEnv === 'development') {
    host = configService.get('DEV_DB_HOST') || configService.get('DB_HOST');
    username =
      configService.get('DEV_DB_USERNAME') || configService.get('DB_USERNAME');
    password =
      configService.get('DEV_DB_PASSWORD') || configService.get('DB_PASSWORD');
    database = configService.get('DEV_DB_NAME') || configService.get('DB_NAME');
  } else {
    host = configService.get('DB_HOST');
    username = configService.get('DB_USERNAME');
    password = configService.get('DB_PASSWORD');
    database = configService.get('DB_NAME');
  }

  return {
    type: 'postgres',
    host,
    port: configService.get('DB_PORT'),
    username,
    password,
    database,
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: nodeEnv === 'development',
    logging: nodeEnv === 'development',
    ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  };
};
