import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  Req,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExtraModels,
  ApiSecurity,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserAuthService } from '../use-cases/user-auth.service';
import { AuthState } from '../domain/services/user-auth.domain.service';
import {
  LoginDto,
  EmailCodeDto,
  ValidateCodeDto,
  UnlinkSocialDto,
  AuthTokenSingleResponseDto,
  UserAuthNullResponseDto,
} from './dtos';
import { ResponseBuilder } from '../../shared/dtos/response.dto';
import { createErrorSchemas } from '../../shared/utils/swagger.util';
import { SecureCustomerGuard } from '../../admin/infrastructure/auth/guards';

interface CustomRequest extends Request {
  _drinkitState?: string;
  _resParams?: Record<string, unknown>;
  _drinkitProfile?: string;
}

@ApiTags('User Auth')
@ApiExtraModels(AuthTokenSingleResponseDto, UserAuthNullResponseDto)
@Controller('auth')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticación de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso',
    type: AuthTokenSingleResponseDto,
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
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthTokenSingleResponseDto> {
    const result = await this.userAuthService.authenticate(loginDto);

    // Configurar cookie de autenticación
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    };

    response.cookie('custmrpomtkn', result.token, cookieOptions);

    return ResponseBuilder.success(
      result,
      'Login exitoso',
    ) as AuthTokenSingleResponseDto;
  }

  @Post('logout')
  @UseGuards(SecureCustomerGuard)
  @ApiSecurity('custmrpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Cerrar sesión de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout exitoso',
    type: UserAuthNullResponseDto,
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
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserAuthNullResponseDto> {
    response.clearCookie('custmrpomtkn');

    return Promise.resolve(
      ResponseBuilder.success(
        null,
        'Logout exitoso',
      ) as UserAuthNullResponseDto,
    );
  }

  @Get('google/:state')
  @ApiOperation({ summary: 'Iniciar autenticación con Google' })
  @ApiParam({
    name: 'state',
    description: 'Datos de estado codificados',
    example: '{"scheme":"drinkitapp","screens":["login"],"intent":"signin"}',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirección a Google exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  @UseGuards(AuthGuard('google-customer'))
  googleAuth(@Param('state') state: string, @Req() req: Request): void {
    // El guard de Passport maneja automáticamente la redirección a Google
    // El estado se pasa a través del query parameter
    req.query = { ...req.query, state };
  }

  @Get('facebook/:state')
  @ApiOperation({ summary: 'Iniciar autenticación con Facebook' })
  @ApiParam({
    name: 'state',
    description: 'Datos de estado codificados',
    example: '{"scheme":"drinkitapp","screens":["login"],"intent":"signin"}',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirección a Facebook exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  @UseGuards(AuthGuard('facebook-customer'))
  facebookAuth(@Param('state') state: string, @Req() req: Request): void {
    // El guard de Passport maneja automáticamente la redirección a Facebook
    req.query = { ...req.query, state };
  }

  @Get('apple/:state')
  @ApiOperation({ summary: 'Iniciar autenticación con Apple' })
  @ApiParam({
    name: 'state',
    description: 'Datos de estado codificados',
    example: '{"scheme":"drinkitapp","screens":["login"],"intent":"signin"}',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redirección a Apple exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  @UseGuards(AuthGuard('apple-customer'))
  appleAuth(@Param('state') state: string, @Req() req: Request): void {
    // El guard de Passport maneja automáticamente la redirección a Apple
    req.query = { ...req.query, state };
  }

  @Post('google_callback')
  @ApiOperation({ summary: 'Callback para autenticación con Google' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autenticación exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  @UseGuards(AuthGuard('google-customer'))
  googleCallback(@Req() req: CustomRequest, @Res() res: Response): void {
    const state: AuthState = JSON.parse(req._drinkitState || '{}') as AuthState;
    const result = (req._resParams || { status: 400, response: 'Error' }) as {
      status: number;
      token?: string;
      response?: string;
    };
    const user = req._drinkitProfile || '';

    const redirectUrl = this.userAuthService.buildRedirectUrl(
      state,
      result,
      user,
    );
    res.redirect(redirectUrl);
  }

  @Post('facebook_callback')
  @ApiOperation({ summary: 'Callback para autenticación con Facebook' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autenticación exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  @UseGuards(AuthGuard('facebook-customer'))
  facebookCallback(@Req() req: CustomRequest, @Res() res: Response): void {
    const state: AuthState = JSON.parse(req._drinkitState || '{}') as AuthState;
    const result = (req._resParams || { status: 400, response: 'Error' }) as {
      status: number;
      token?: string;
      response?: string;
    };
    const user = req._drinkitProfile || '';

    const redirectUrl = this.userAuthService.buildRedirectUrl(
      state,
      result,
      user,
    );
    res.redirect(redirectUrl);
  }

  @Post('apple_callback')
  @ApiOperation({ summary: 'Callback para autenticación con Apple' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autenticación exitosa',
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  @UseGuards(AuthGuard('apple-customer'))
  appleCallback(@Req() req: CustomRequest, @Res() res: Response): void {
    const state: AuthState = JSON.parse(req._drinkitState || '{}') as AuthState;
    const result = (req._resParams || { status: 400, response: 'Error' }) as {
      status: number;
      token?: string;
      response?: string;
    };
    const user = req._drinkitProfile || '';

    const redirectUrl = this.userAuthService.buildRedirectUrl(
      state,
      result,
      user,
    );
    res.redirect(redirectUrl);
  }

  @Post('unlink')
  @UseGuards(SecureCustomerGuard)
  @ApiSecurity('custmrpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Desvincular cuenta social' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cuenta desvinculada exitosamente',
    type: UserAuthNullResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
    schema: createErrorSchemas()[401],
  })
  @ApiResponse({
    status: 400,
    description: 'Error en la solicitud',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async unlinkSocial(
    @Body() unlinkDto: UnlinkSocialDto,
  ): Promise<UserAuthNullResponseDto> {
    await this.userAuthService.unlinkSocialAccount(unlinkDto);
    return ResponseBuilder.success(
      null,
      'Cuenta desvinculada exitosamente',
    ) as UserAuthNullResponseDto;
  }

  @Post('email-code')
  @ApiOperation({ summary: 'Solicitar código de verificación por email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Código enviado exitosamente',
    type: UserAuthNullResponseDto,
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
  requestEmailCode(
    @Body() emailCodeDto: EmailCodeDto,
  ): UserAuthNullResponseDto {
    this.userAuthService.requestEmailCode(emailCodeDto);
    return ResponseBuilder.success(
      null,
      `Código enviado a: ${emailCodeDto.email}`,
    ) as UserAuthNullResponseDto;
  }

  @Post('email-verification')
  @ApiOperation({ summary: 'Validar código de verificación' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verificado exitosamente',
    type: UserAuthNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido',
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
  async validateEmailCode(
    @Body() validateCodeDto: ValidateCodeDto,
  ): Promise<UserAuthNullResponseDto> {
    await this.userAuthService.validateEmailCode(validateCodeDto);
    return ResponseBuilder.success(
      null,
      'Email verificado exitosamente',
    ) as UserAuthNullResponseDto;
  }
}
