import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../../shared/services/base.service';
import { UserAuthRepositoryImpl } from '../infrastructure/repositories/user-auth.repository.impl';
import { BlacklistRepositoryImpl } from '../infrastructure/repositories/blacklist.repository.impl';
import { AppleFallbackRepositoryImpl } from '../infrastructure/repositories/apple-fallback.repository.impl';
import {
  UserAuthDomainService,
  SocialAuthData,
  AuthState,
  SocialProfile,
} from '../domain/services/user-auth.domain.service';
import {
  LoginDto,
  EmailCodeDto,
  ValidateCodeDto,
  UnlinkSocialDto,
} from '../interfaces/dtos';

interface SocialAuthResult {
  status: number;
  token?: string;
  response?: string;
}

@Injectable()
export class UserAuthService extends BaseService {
  constructor(
    private readonly userRepository: UserAuthRepositoryImpl,
    private readonly blacklistRepository: BlacklistRepositoryImpl,
    private readonly appleFallbackRepository: AppleFallbackRepositoryImpl,
    private readonly userAuthDomainService: UserAuthDomainService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async authenticate(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      this.logInfo('Iniciando autenticación de usuario', {
        email: loginDto.email,
        username: loginDto.username,
      });

      // Verificar blacklist si es por email
      if (loginDto.email) {
        const blacklistedEmails = await this.blacklistRepository.getAllEmails();
        if (blacklistedEmails.includes(loginDto.email.toLowerCase().trim())) {
          throw new ForbiddenException(
            'La cuenta está suspendida por violación de los términos y condiciones de uso',
          );
        }
      }

      // Buscar usuario
      const user = await this.userRepository.findByCredentials(
        loginDto.username,
        loginDto.email,
      );
      if (!user) {
        throw new UnauthorizedException('Usuario inválido');
      }

      // Validar contraseña
      if (
        !this.userAuthDomainService.validatePassword(
          loginDto.password,
          user.password,
        )
      ) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      // Generar token
      const token = this.jwtService.sign({
        user: { usersId: user.id, ...user },
      });

      this.logInfo('Autenticación exitosa', { userId: user.id });
      return { token };
    } catch (error) {
      this.handleServiceError(error, 'Error en autenticación');
    }
  }

  requestEmailCode(emailCodeDto: EmailCodeDto): void {
    try {
      this.logInfo('Solicitando código de email', {
        email: emailCodeDto.email,
      });

      // TODO: Implementar envío de código por email usando SendGrid
      // const data = {
      //   smtpInfo: {
      //     host: 'smtp.sendgrid.net',
      //     port: 587,
      //     user: 'apikey',
      //     pass: this.configService.get('SENDGRID_API_KEY'),
      //   },
      //   company: {
      //     name: 'Drinkit App',
      //     email: this.configService.get('SENDGRID_FROM_EMAIL'),
      //   },
      //   mailInfo: {
      //     emailReceiver: emailCodeDto.email,
      //     subject: 'Verificación de correo electrónico | Drinkit App',
      //     html(code) { return templateHTML; }
      //   },
      // };
      // await sendCode(data);

      this.logInfo('Código de email enviado exitosamente', {
        email: emailCodeDto.email,
      });
    } catch (error) {
      this.handleServiceError(error, 'Error enviando código de email');
    }
  }

  async validateEmailCode(validateCodeDto: ValidateCodeDto): Promise<void> {
    try {
      this.logInfo('Validando código de email', {
        email: validateCodeDto.email,
      });

      // TODO: Implementar validación de código
      // const response = verifyCode(validateCodeDto.email, validateCodeDto.code);
      // if (response.error) {
      //   throw new BadRequestException(response.message);
      // }

      // Actualizar estado de verificación
      await this.userRepository.updateVerificationStatus(
        validateCodeDto.email,
        true,
      );

      this.logInfo('Email verificado exitosamente', {
        email: validateCodeDto.email,
      });
    } catch (error) {
      this.handleServiceError(error, 'Error validando código de email');
    }
  }

  async unlinkSocialAccount(unlinkDto: UnlinkSocialDto): Promise<void> {
    try {
      this.logInfo('Desvinculando cuenta social', {
        userId: unlinkDto.usersId,
        provider: unlinkDto.provider,
      });

      await this.userRepository.unlinkSocialAccount(
        parseInt(unlinkDto.usersId),
        unlinkDto.provider,
      );

      this.logInfo('Cuenta social desvinculada exitosamente');
    } catch (error) {
      this.handleServiceError(error, 'Error desvinculando cuenta social');
    }
  }

  async socialAuth(
    profile: SocialProfile,
    state: AuthState,
  ): Promise<SocialAuthResult> {
    try {
      const userData = this.userAuthDomainService.mapSocialProfile(profile);

      this.logInfo('Iniciando autenticación social', {
        provider: userData.provider,
        intent: state.intent,
      });

      if (state.intent === 'linking') {
        return await this.linkSocialAccount(userData, state);
      } else if (state.intent === 'signin') {
        if (userData.provider === 'apple') {
          return await this.appleSignIn(userData);
        } else {
          return await this.socialSignIn(userData);
        }
      }
    } catch (error) {
      this.handleServiceError(error, 'Error en autenticación social');
    }

    return { status: 400, response: 'Error en autenticación social' };
  }

  private async socialSignIn(
    userData: SocialAuthData,
  ): Promise<SocialAuthResult> {
    // Verificar blacklist
    if (userData.email) {
      const blacklistedEmails = await this.blacklistRepository.getAllEmails();
      if (blacklistedEmails.includes(userData.email)) {
        return {
          status: 403,
          response:
            'La cuenta está suspendida por violación de los términos y condiciones de uso',
        };
      }
    }

    // Buscar usuario existente
    const user = await this.userRepository.findByEmailOrSocialId(
      userData.email,
      userData.id,
      userData.provider,
    );

    if (user) {
      // Actualizar IDs sociales si es necesario
      if (userData.provider === 'google' && !user.googleId) {
        await this.userRepository.linkSocialAccount(
          Number(user.id),
          userData.id,
          'google',
        );
      }
      if (userData.provider === 'facebook' && !user.facebookId) {
        await this.userRepository.linkSocialAccount(
          Number(user.id),
          userData.id,
          'facebook',
        );
      }
      if (userData.provider === 'apple' && !user.appleId) {
        await this.userRepository.linkSocialAccount(
          Number(user.id),
          userData.id,
          'apple',
        );
      }

      // Generar token
      const token = this.jwtService.sign({
        user: { usersId: user.id, ...user },
      });
      return { status: 200, token };
    } else {
      // Crear nuevo usuario
      const newUserData =
        this.userAuthDomainService.createUserFromSocial(userData);
      const newUser = await this.userRepository.create(newUserData);

      // TODO: Enviar email de bienvenida
      // await this.sendWelcomeEmail(newUser.email);

      const token = this.jwtService.sign({
        user: { usersId: newUser.id, ...newUser },
      });
      return { status: 200, token };
    }
  }

  private async appleSignIn(
    userData: SocialAuthData,
  ): Promise<SocialAuthResult> {
    // Buscar en apple fallbacks
    let appleFallback = await this.appleFallbackRepository.findByAppleId(
      userData.id,
    );

    if (!appleFallback) {
      // Crear nuevo apple fallback
      const fallbackData =
        this.userAuthDomainService.createAppleFallbackFromProfile(userData);
      appleFallback = await this.appleFallbackRepository.create(fallbackData);
    }

    // Continuar con el flujo normal de signin
    const profileData = {
      ...userData,
      firstname: appleFallback.firstname || userData.firstname,
      lastname: appleFallback.lastname || userData.lastname,
      email: appleFallback.email || userData.email,
      photo: appleFallback.photo || userData.photo,
    };

    return await this.socialSignIn(profileData);
  }

  private async linkSocialAccount(
    userData: SocialAuthData,
    state: AuthState,
  ): Promise<SocialAuthResult> {
    if (!state.usersId) {
      return {
        status: 400,
        response: 'ID de usuario requerido para vincular cuenta',
      };
    }

    // Verificar que no esté ya vinculada a otra cuenta
    const existingUser = await this.userRepository.findBySocialId(
      userData.id,
      userData.provider,
    );
    if (existingUser && Number(existingUser.id) !== state.usersId) {
      return {
        status: 400,
        response: 'La cuenta ya está vinculada a otro usuario',
      };
    }

    // Vincular cuenta
    await this.userRepository.linkSocialAccount(
      state.usersId,
      userData.id,
      userData.provider,
    );

    return { status: 200, response: 'Cuenta vinculada exitosamente' };
  }

  buildRedirectUrl(
    state: AuthState,
    result: SocialAuthResult,
    user?: string,
  ): string {
    return this.userAuthDomainService.buildRedirectUrl(state, result, user);
  }
}
