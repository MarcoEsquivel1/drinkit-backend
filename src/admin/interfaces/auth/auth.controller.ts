import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UserAuthenticationDto,
  UserPasswordRecoveryDto,
  UserChangePasswordDto,
  AuthenticationResponseDto,
} from './dtos';
import { CredentialsGuard } from '../../infrastructure/auth/guards';
import { ResponseDto, ResponseBuilder } from '../../../shared/utils';
import { AuthService } from '../../use-cases/auth/auth.service';

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticación de administrador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso',
    type: AuthenticationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
    type: ResponseDto,
  })
  async login(
    @Body() loginDto: UserAuthenticationDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto<any>> {
    try {
      const authResult = await this.authService.validateAdmin(
        loginDto.email,
        loginDto.password,
      );

      if (!authResult) {
        return ResponseBuilder.error('Credenciales inválidas');
      }

      const payload = { id: authResult.id };
      const token = this.jwtService.sign(payload);

      const cookieOptions = {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict' as const,
        maxAge: loginDto.remember
          ? 30 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000,
      };

      response.cookie('admnpomtkn', token, cookieOptions);

      await this.authService.updateLoginStatus(authResult.id, true);

      return ResponseBuilder.success(authResult, 'Login exitoso');
    } catch (error) {
      return ResponseBuilder.error('Error en el proceso de autenticación');
    }
  }

  @Post('logout')
  @UseGuards(CredentialsGuard)
  @ApiOperation({ summary: 'Cerrar sesión de administrador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout exitoso',
    type: ResponseDto,
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto> {
    try {
      const user = request.user as any;

      if (user?.id) {
        await this.authService.updateLoginStatus(user.id, false);
      }

      response.clearCookie('admnpomtkn');

      return ResponseBuilder.success(null, 'Logout exitoso');
    } catch (error) {
      return ResponseBuilder.error('Error al cerrar sesión');
    }
  }

  @Get('me')
  @UseGuards(CredentialsGuard)
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Información del usuario',
    type: AuthenticationResponseDto,
  })
  async getProfile(@Req() request: Request): Promise<ResponseDto<any>> {
    try {
      const user = request.user as any;
      return ResponseBuilder.success(user, 'Información del usuario obtenida');
    } catch (error) {
      return ResponseBuilder.error('Error al obtener información del usuario');
    }
  }

  @Post('password-recovery')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email de recuperación enviado',
    type: ResponseDto,
  })
  async passwordRecovery(
    @Body() recoveryDto: UserPasswordRecoveryDto,
  ): Promise<ResponseDto> {
    try {
      await this.authService.initiatePasswordRecovery(recoveryDto.email);
      return ResponseBuilder.success(
        null,
        'Email de recuperación enviado exitosamente',
      );
    } catch (error) {
      return ResponseBuilder.error(
        'Error al procesar solicitud de recuperación',
      );
    }
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña con token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña cambiada exitosamente',
    type: ResponseDto,
  })
  async changePassword(
    @Body() changePasswordDto: UserChangePasswordDto,
  ): Promise<ResponseDto> {
    try {
      await this.authService.changePassword(
        changePasswordDto.uuid,
        changePasswordDto.newPassword,
      );
      return ResponseBuilder.success(null, 'Contraseña cambiada exitosamente');
    } catch (error) {
      return ResponseBuilder.error('Error al cambiar contraseña');
    }
  }
}
