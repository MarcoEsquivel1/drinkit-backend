import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Strategy, VerifiedCallback } from 'passport-jwt';
import { VerifyAccessEvent } from '../../../domain/events/verify-access.event';
import { AuthenticationData, JwtPayload } from '../interfaces';
import { handleError, wait } from '../../../../shared/utils';

@Injectable()
export class SecureCustomerStrategy extends PassportStrategy(
  Strategy,
  'secure-customer',
) {
  private readonly logger: Logger;
  private refreshingData: boolean;
  private refreshSemaphore: Promise<void>;
  private resolveRefresh: () => void = () => Promise.resolve();

  constructor(
    private readonly event: VerifyAccessEvent,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        let token = null;
        if (req?.cookies?.custmrpomtkn) {
          token = req.cookies.custmrpomtkn;
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'default-secret',
    });
    this.logger = new Logger(SecureCustomerStrategy.name);
    this.refreshingData = false;
    this.refreshSemaphore = Promise.resolve();
  }

  private async refreshAuthData(
    id: string,
  ): Promise<AuthenticationData | object> {
    if (this.refreshingData) {
      this.logger.debug('Wait for Data Refresh');
      await this.waitForDataRefresh();
      return await this.getRefreshedData(id);
    }

    this.refreshingData = true;

    try {
      const refreshedData = await this.performDataRefresh(id);
      this.refreshingData = false;
      this.resolveRefresh();
      return refreshedData;
    } catch (error) {
      this.refreshingData = false;
      this.resolveRefresh();
      handleError(error, this.logger);
      return {};
    }
  }

  private waitForDataRefresh(): Promise<void> {
    this.refreshSemaphore = new Promise<void>((resolve) => {
      this.resolveRefresh = resolve;
    });
    return this.refreshSemaphore;
  }

  private async getRefreshedData(
    id: string,
    sleep = 0,
  ): Promise<AuthenticationData> {
    await wait(sleep);
    return JSON.parse((await this.cacheService.get(`customer-${id}`)) || '{}');
  }

  private async performDataRefresh(id: string): Promise<AuthenticationData> {
    this.logger.debug('Perform new access data');
    const data = await this.event.checkCustomer(id);
    if (data) {
      await this.cacheService.set(
        `customer-${id}`,
        JSON.stringify(data),
        10000,
      );
    }
    return await this.getRefreshedData(id, 100);
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<void> {
    let user: Partial<AuthenticationData> = await this.getRefreshedData(
      payload.id,
    );
    if (!user.id) {
      user = await this.refreshAuthData(payload.id);
    }
    if (!user) {
      return done(
        new HttpException(
          "User doesn't exist. Authorization Denied.",
          HttpStatus.UNAUTHORIZED,
        ),
        false,
      );
    }
    if (!user.enabled) {
      return done(
        new HttpException('User is deactivated.', HttpStatus.FORBIDDEN),
        false,
      );
    }
    if (!user.isLoggedIn) {
      return done(
        new HttpException(
          'User is already logout. Try to login. Authorization Denied.',
          HttpStatus.UNAUTHORIZED,
        ),
        false,
      );
    }

    return done(null, user, payload.iat);
  }
}
