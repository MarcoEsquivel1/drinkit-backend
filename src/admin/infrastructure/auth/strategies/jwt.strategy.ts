import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { VerifyAccessEvent } from '../../../domain/events/verify-access.event';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly event: VerifyAccessEvent,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<void> {
    const cacheUser: any = JSON.parse(
      (await this.cacheService.get(`user-${payload.id}`)) || '{}',
    );
    let user = cacheUser;
    if (!user.id) {
      user = await this.event.check(payload.id);
    }
    if (!user) {
      return done(
        new HttpException('UNAUTHORIZED TOKEN', HttpStatus.UNAUTHORIZED),
        false,
      );
    }
    if (!user.enabled) {
      return done(
        new HttpException('FORBIDDEN ACTION', HttpStatus.FORBIDDEN),
        false,
      );
    }
    if (!cacheUser.id) {
      await this.cacheService.set(
        `user-${payload.id}`,
        JSON.stringify(user),
        10000,
      );
    }
    return done(null, user, payload.iat);
  }
}
