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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  ApiSecurity,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UserAuthenticationDto,
  UserPasswordRecoveryDto,
  UserChangePasswordDto,
  AuthenticatedUserDto,
  AuthSingleResponseDto,
  AdminAuthNullResponseDto,
} from './dtos';
import { CredentialsGuard } from '../../infrastructure/auth/guards';
import { ResponseBuilder } from '../../../shared/dtos/response.dto';
import { AuthService } from '../../use-cases/auth/auth.service';
import { createErrorSchemas } from '../../../shared/utils/swagger.util';

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  surname: string;
  enabled: boolean;
  isLoggedIn: boolean;
  role: {
    id: number;
    name: string;
  };
}

@ApiTags('Admin Auth')
@ApiExtraModels(
  AuthenticatedUserDto,
  AuthSingleResponseDto,
  AdminAuthNullResponseDto,
)
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
    type: AuthSingleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async login(
    @Body() loginDto: UserAuthenticationDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSingleResponseDto> {
    const authResult = await this.authService.validateAdmin(
      loginDto.email,
      loginDto.password,
    );

    if (!authResult) {
      return ResponseBuilder.error(
        'Credenciales inválidas',
      ) as unknown as AuthSingleResponseDto;
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

    return ResponseBuilder.success(
      authResult,
      'Login exitoso',
    ) as unknown as AuthSingleResponseDto;
  }

  @Post('logout')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Cerrar sesión de administrador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout exitoso',
    type: AdminAuthNullResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AdminAuthNullResponseDto> {
    const user = request.user as AuthenticatedUser;

    if (user?.id) {
      await this.authService.updateLoginStatus(user.id, false);
    }

    response.clearCookie('admnpomtkn');

    return ResponseBuilder.success(
      null,
      'Logout exitoso',
    ) as AdminAuthNullResponseDto;
  }

  @Get('me')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Información del usuario',
    type: AuthSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  getProfile(@Req() request: Request): AuthSingleResponseDto {
    const user = request.user as AuthenticatedUser;
    return ResponseBuilder.success(
      user,
      'Información del usuario obtenida',
    ) as AuthSingleResponseDto;
  }

  @Post('password-recovery')
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email de recuperación enviado',
    type: AdminAuthNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async passwordRecovery(
    @Body() recoveryDto: UserPasswordRecoveryDto,
  ): Promise<AdminAuthNullResponseDto> {
    await this.authService.initiatePasswordRecovery(recoveryDto.email);
    return ResponseBuilder.success(
      null,
      'Email de recuperación enviado exitosamente',
    ) as AdminAuthNullResponseDto;
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña con token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña cambiada exitosamente',
    type: AdminAuthNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido o expirado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación',
    schema: createErrorSchemas()[422],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async changePassword(
    @Body() changePasswordDto: UserChangePasswordDto,
  ): Promise<AdminAuthNullResponseDto> {
    await this.authService.changePassword(
      changePasswordDto.uuid,
      changePasswordDto.newPassword,
    );
    return ResponseBuilder.success(
      null,
      'Contraseña cambiada exitosamente',
    ) as AdminAuthNullResponseDto;
  }

  @Get('test-auth')
  @UseGuards(CredentialsGuard)
  @ApiSecurity('admnpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Test de autenticación mod' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Guard funcionando correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  testAuth(@Req() request: Request): any {
    const cookies = request.cookies as Record<string, string> | undefined;
    return {
      success: true,
      message: 'Guard funcionando correctamente',
      user: request.user,
      cookies: cookies || {},
      headers: request.headers,
    };
  }
}
