import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get('NODE_ENV') as string;

  let host: string, username: string, password: string, database: string;

  if (nodeEnv === 'test') {
    host = configService.get('TEST_DB_HOST') as string;
    username = configService.get('TEST_DB_USERNAME') as string;
    password = configService.get('TEST_DB_PASSWORD') as string;
    database = configService.get('TEST_DB_NAME') as string;
  } else if (nodeEnv === 'development') {
    host =
      configService.get('DEV_DB_HOST') ||
      (configService.get('DB_HOST') as string);
    username =
      configService.get('DEV_DB_USERNAME') ||
      (configService.get('DB_USERNAME') as string);
    password =
      configService.get('DEV_DB_PASSWORD') ||
      (configService.get('DB_PASSWORD') as string);
    database =
      configService.get('DEV_DB_NAME') ||
      (configService.get('DB_NAME') as string);
  } else {
    host = configService.get('DB_HOST') as string;
    username = configService.get('DB_USERNAME') as string;
    password = configService.get('DB_PASSWORD') as string;
    database = configService.get('DB_NAME') as string;
  }

  return {
    type: 'postgres',
    host,
    port: configService.get('DB_PORT') as number,
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
