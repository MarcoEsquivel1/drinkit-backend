import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifiedCallback } from 'passport-custom';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  private readonly logger = new Logger(ApiKeyStrategy.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async validate(request: Request, done: VerifiedCallback): Promise<void> {
    const apiKey = request.headers['x-api-key'] as string;
    if (!apiKey) {
      return done(
        new HttpException('API key not provided', HttpStatus.UNAUTHORIZED),
        false,
      );
    }

    let allowedKeys: string[] =
      ((await this.cacheService.get('allowedApiKeys')) as string[]) ?? [];

    if (allowedKeys.length === 0) {
      const envApiKey = this.configService.get<string>('API_KEY_ADMIN');
      if (envApiKey) {
        allowedKeys = [envApiKey];
      }
    }

    if (!allowedKeys || !allowedKeys.includes(apiKey)) {
      this.logger.error(`Invalid API key: ${apiKey}`);
      return done(
        new HttpException('Invalid API key', HttpStatus.UNAUTHORIZED),
        false,
      );
    }

    return done(null, true);
  }
}
