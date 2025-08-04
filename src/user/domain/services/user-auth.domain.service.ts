import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../infrastructure/database/entities/user.entity';
import { AppleFallback } from '../../infrastructure/database/entities/apple-fallback.entity';

export interface SocialAuthData {
  provider: 'google' | 'facebook' | 'apple';
  id: string;
  displayName: string;
  firstname: string;
  lastname: string;
  email: string;
  photo?: string;
}

export interface AuthState {
  scheme: string;
  host?: string;
  screens: string[];
  intent: 'signin' | 'linking';
  fallback?: string[];
  query?: string[];
  usersId?: number;
}

export interface SocialProfile {
  provider: string;
  id: string;
  displayName: string;
  given_name?: string;
  family_name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  picture?: string;
  photo?: string;
  emails?: Array<{ value: string }>;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  photos?: Array<{ value: string }>;
}

@Injectable()
export class UserAuthDomainService {
  generatePassword(): string {
    return bcrypt.hashSync(Date.now().toString(16), 15);
  }

  validatePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  createUserFromSocial(profile: SocialAuthData): Partial<User> {
    return {
      password: this.generatePassword(),
      enabled: true,
      name: profile.firstname,
      email: profile.email,
      verify: true,
      photo: profile.photo,
      facebookId: profile.provider === 'facebook' ? profile.id : undefined,
      googleId: ['google', 'google-one-tap'].includes(profile.provider)
        ? profile.id
        : undefined,
      appleId: profile.provider === 'apple' ? profile.id : undefined,
      roleId: 3, // Cliente por defecto
      createdBy: '1', // Sistema
    };
  }

  mapSocialProfile(profile: SocialProfile): SocialAuthData {
    if (profile.provider === 'google-one-tap') {
      profile.email = profile.emails?.[0]?.value ?? '';
      profile.given_name = profile?.name?.givenName ?? '';
      profile.family_name = profile?.name?.familyName ?? '';
      profile.picture = profile?.photos?.[0]?.value ?? '';
    }

    return {
      provider: profile.provider as 'google' | 'facebook' | 'apple',
      id: profile.id,
      displayName: profile.displayName || '',
      firstname: profile.given_name || profile.firstname || '',
      lastname: profile.family_name || profile.lastname || '',
      email: profile.email || '',
      photo: profile.picture || profile.photo || '',
    };
  }

  createAppleFallbackFromProfile(
    userData: SocialAuthData,
  ): Partial<AppleFallback> {
    return {
      appleId: userData.id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      displayName: userData.displayName,
      photo: userData.photo,
    };
  }

  getSocialFieldMapping(provider: 'google' | 'facebook' | 'apple'): {
    [key: string]: string;
  } {
    const mapping = {
      google: { googleId: 'googleId' },
      facebook: { facebookId: 'facebookId' },
      apple: { appleId: 'appleId' },
    };
    return mapping[provider] || {};
  }

  buildRedirectUrl(
    state: AuthState,
    result: { status: number; token?: string; response?: string },
    user?: string,
  ): string {
    let url = '';

    if (state.intent === 'signin') {
      if (result.status === 200) {
        url = `${state.scheme}://${state.host ? `${state.host}/` : ''}${
          state.screens.length > 0 ? `${state.screens.join('/')}` : ''
        }?data=${JSON.stringify({
          token: result.token,
        })}${state.query && state.query.length > 0 ? '&' + state.query.join('&') : ''}`;
      } else if (result.status === 404 && state.fallback) {
        url = `${state.scheme}://${state.host ? `${state.host}/` : ''}${
          state.fallback.length > 0 ? `${state.fallback.join('/')}` : ''
        }?data=${user}${state.query && state.query.length > 0 ? '&' + state.query.join('&') : ''}`;
      } else if (result.status === 400 || result.status === 403) {
        url = `${state.scheme}://${state.host ? `${state.host}/` : ''}${
          state.screens.length > 0 ? `${state.screens.join('/')}` : ''
        }?data=${JSON.stringify({
          error: result.response,
        })}${state.query && state.query.length > 0 ? '&' + state.query.join('&') : ''}`;
      }
    } else if (state.intent === 'linking') {
      if (result.status === 200) {
        url = `${state.scheme}://${state.host ? `${state.host}/` : ''}${
          state.screens.length > 0 ? `${state.screens.join('/')}` : ''
        }`;
      } else if (result.status === 400 || result.status === 404) {
        url = `${state.scheme}://${state.host ? `${state.host}/` : ''}${
          state.screens.length > 0 ? `${state.screens.join('/')}` : ''
        }?data=${JSON.stringify({ error: result.response })}${
          state.query && state.query.length > 0
            ? '&' + state.query.join('&')
            : ''
        }`;
      }
    }

    return url;
  }
}
