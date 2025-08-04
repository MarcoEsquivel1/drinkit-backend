import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { UserAuthService } from '../../../use-cases/user-auth.service';
import { AuthState } from '../../../domain/services/user-auth.domain.service';

interface GoogleProfile {
  id: string;
  displayName?: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  given_name?: string;
  family_name?: string;
}

interface CustomRequest {
  query?: { state?: string };
  _drinkitProfile?: string;
  _drinkitState?: string;
  _resParams?: any;
}

type VerifyCallback = (error: any, user?: any, info?: any) => void;

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google-customer',
) {
  private readonly logger = new Logger(GoogleStrategy.name);

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
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: `${apiUrl}auth/google_callback`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    req: CustomRequest,
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      this.logger.log(`Google auth validation for user: ${profile.id}`);

      // Obtener state del query
      const stateString = req.query?.state || '{}';
      const state: AuthState = JSON.parse(stateString) as AuthState;

      // Guardar datos en el request para el callback
      req._drinkitProfile = JSON.stringify(profile);
      req._drinkitState = JSON.stringify(state);

      // Procesar autenticación social
      const socialProfile = {
        provider: 'google',
        id: profile.id,
        displayName: profile.displayName || '',
        given_name: profile.given_name || '',
        family_name: profile.family_name || '',
        email: profile.emails?.[0]?.value || '',
        picture: profile.photos?.[0]?.value || '',
      };
      const result = await this.userAuthService.socialAuth(
        socialProfile,
        state,
      );
      req._resParams = result;

      return done(null, profile);
    } catch (error: unknown) {
      this.logger.error('Error en autenticación Google:', error);
      req._resParams = {
        status: 400,
        response: `Error en autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      };
      return done(null, profile);
    }
  }
}
