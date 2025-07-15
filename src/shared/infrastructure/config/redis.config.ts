import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';

export const getRedisConfig = async (
  configService: ConfigService,
): Promise<CacheModuleOptions> => {
  return {
    store: await redisStore({
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
      db: configService.get('REDIS_DATABASES'),
      ttl: 86400,
    }),
    isGlobal: true,
  };
};
