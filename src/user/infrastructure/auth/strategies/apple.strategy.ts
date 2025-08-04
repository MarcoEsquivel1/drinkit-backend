import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Strategy } from '@nicokaiser/passport-apple';
import { readFileSync } from 'fs';
import { UserAuthService } from '../../../use-cases/user-auth.service';
import { AuthState } from '../../../domain/services/user-auth.domain.service';

interface AppleProfile {
  id: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
  picture?: string;
}

interface CustomRequest {
  body?: { state?: string };
  query?: { state?: string };
  _drinkitProfile?: string;
  _drinkitState?: string;
  _resParams?: any;
}

type VerifyCallback = (error: any, user?: any, info?: any) => void;

@Injectable()
export class AppleStrategy extends PassportStrategy(
  Strategy,
  'apple-customer',
) {
  private readonly logger = new Logger(AppleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userAuthService: UserAuthService,
  ) {
    const apiUrl =
      configService.get<string>('NODE_ENV') === 'production'
        ? configService.get<string>('DRINKIT_API_URL') || ''
        : configService.get<string>('DRINKIT_DEV_API_URL') || '';

    const keyLocation = configService.get<string>('APPLE_KEY_LOCATION');
    const key = keyLocation ? readFileSync(keyLocation) : '';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID') || '',
      teamID: configService.get<string>('APPLE_TEAM_ID') || '',
      keyID: configService.get<string>('APPLE_KEY_ID') || '',
      key: key,
      scope: ['name', 'email'],
      callbackURL: `${apiUrl}auth/apple_callback`,
      passReqToCallback: true,
    } as any);
  }

  async validate(
    req: CustomRequest,
    accessToken: string,
    refreshToken: string,
    profile: AppleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      this.logger.log(`Apple auth validation for user: ${profile.id}`);

      // Normalizar perfil de Apple
      const normalizedProfile = {
        provider: 'apple' as const,
        id: profile.id,
        displayName:
          profile.name?.firstName && profile.name?.lastName
            ? `${profile.name.firstName} ${profile.name.lastName}`
            : '',
        given_name: profile.name?.firstName || '',
        family_name: profile.name?.lastName || '',
        email: profile.email || '',
        picture: profile.picture || '',
      };

      // Obtener state del query o body
      const stateString = req.body?.state || req.query?.state || '{}';
      const state: AuthState = JSON.parse(stateString) as AuthState;

      // Guardar datos en el request para el callback
      req._drinkitProfile = JSON.stringify(normalizedProfile);
      req._drinkitState = JSON.stringify(state);

      // Procesar autenticación social
      const socialProfile = {
        provider: normalizedProfile.provider,
        id: normalizedProfile.id,
        displayName: normalizedProfile.displayName,
        given_name: normalizedProfile.given_name,
        family_name: normalizedProfile.family_name,
        email: normalizedProfile.email,
        picture: normalizedProfile.picture,
      };
      const result = await this.userAuthService.socialAuth(
        socialProfile,
        state,
      );
      req._resParams = result;

      return done(null, normalizedProfile);
    } catch (error: unknown) {
      this.logger.error('Error en autenticación Apple:', error);
      req._resParams = {
        status: 400,
        response: `Error en autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
      return done(null, profile);
    }
  }
}
