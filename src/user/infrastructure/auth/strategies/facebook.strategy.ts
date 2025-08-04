import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { UserAuthService } from '../../../use-cases/user-auth.service';
import { AuthState } from '../../../domain/services/user-auth.domain.service';

interface FacebookProfile {
  id: string;
  displayName?: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  given_name?: string;
  family_name?: string;
  _json?: {
    name?: string;
    email?: string;
    picture?: {
      data?: {
        url?: string;
      };
    };
  };
}

interface CustomRequest {
  query?: { state?: string };
  _drinkitProfile?: string;
  _drinkitState?: string;
  _resParams?: any;
}

type VerifyCallback = (error: any, user?: any, info?: any) => void;

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  'facebook-customer',
) {
  private readonly logger = new Logger(FacebookStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userAuthService: UserAuthService,
  ) {
    const apiUrl =
      configService.get<string>('NODE_ENV') === 'production'
        ? configService.get<string>('DRINKIT_API_URL') || ''
        : configService.get<string>('DRINKIT_DEV_API_URL') || '';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID') || '',
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET') || '',
      callbackURL: `${apiUrl}auth/facebook_callback`,
      passReqToCallback: true,
      enableProof: true,
      profileFields: ['id', 'displayName', 'photos', 'email'],
      scope: ['email'],
    });
  }

  async validate(
    req: CustomRequest,
    accessToken: string,
    refreshToken: string,
    profile: FacebookProfile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      this.logger.log(`Facebook auth validation for user: ${profile.id}`);

      // Normalizar perfil de Facebook
      const normalizedProfile = {
        provider: 'facebook' as const,
        id: profile.id,
        displayName: profile.displayName || '',
        given_name:
          profile.given_name || profile._json?.name?.split?.(' ')?.[0] || '',
        family_name:
          profile.family_name ||
          profile._json?.name?.split?.(' ')?.slice?.(1)?.join?.(' ') ||
          '',
        picture:
          profile.photos?.[0]?.value || profile._json?.picture?.data?.url || '',
        email: profile._json?.email || profile.emails?.[0]?.value || profile.id,
      };

      // Obtener state del query
      const stateString = req.query?.state || '{}';
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
      this.logger.error('Error en autenticación Facebook:', error);
      req._resParams = {
        status: 400,
        response: `Error en autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
      return done(null, profile);
    }
  }
}
