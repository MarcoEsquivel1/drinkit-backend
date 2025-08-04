import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiSecurity,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from '../use-cases/user.service';
import { SecureCustomerGuard } from '../../admin/infrastructure/auth/guards';
import {
  RegisterUserDto,
  ActivateAccountDto,
  ChangePasswordDto,
  UpdateUserDto,
  RequestPasswordRecoveryDto,
  ResetPasswordDto,
  UserSingleResponseDto,
  UserNullResponseDto,
} from './dtos';
import { ResponseBuilder } from '../../shared/dtos/response.dto';
import { createErrorSchemas } from '../../shared/utils/swagger.util';

interface AuthenticatedUser {
  usersId: string;
  email: string;
  username: string;
}

@ApiTags('Users')
@ApiExtraModels(UserSingleResponseDto, UserNullResponseDto)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    type: UserSingleResponseDto,
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
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<UserSingleResponseDto> {
    const user = await this.userService.register(registerDto);
    return ResponseBuilder.success(
      user,
      'Usuario registrado exitosamente. Verifica tu email para activar la cuenta.',
    ) as UserSingleResponseDto;
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar cuenta de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cuenta activada exitosamente',
    type: UserNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido o expirado',
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
  async activate(
    @Body() activateDto: ActivateAccountDto,
  ): Promise<UserNullResponseDto> {
    await this.userService.activateAccount(activateDto);
    return ResponseBuilder.success(
      null,
      'Cuenta activada exitosamente',
    ) as UserNullResponseDto;
  }

  @Get('profile')
  @UseGuards(SecureCustomerGuard)
  @ApiSecurity('custmrpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil obtenido exitosamente',
    type: UserSingleResponseDto,
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
  async getProfile(@Req() request: Request): Promise<UserSingleResponseDto> {
    const user = request.user as AuthenticatedUser;
    const profile = await this.userService.getProfile(user.usersId);
    return ResponseBuilder.success(
      profile,
      'Perfil obtenido exitosamente',
    ) as UserSingleResponseDto;
  }

  @Patch('profile')
  @UseGuards(SecureCustomerGuard)
  @ApiSecurity('custmrpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Actualizar perfil del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil actualizado exitosamente',
    type: UserSingleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
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
  async updateProfile(
    @Req() request: Request,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserSingleResponseDto> {
    const user = request.user as AuthenticatedUser;
    const updatedUser = await this.userService.updateProfile(
      user.usersId,
      updateDto,
    );
    return ResponseBuilder.success(
      updatedUser,
      'Perfil actualizado exitosamente',
    ) as UserSingleResponseDto;
  }

  @Post('change-password')
  @UseGuards(SecureCustomerGuard)
  @ApiSecurity('custmrpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Cambiar contraseña del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña cambiada exitosamente',
    type: UserNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Contraseña actual incorrecta',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
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
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<UserNullResponseDto> {
    const user = request.user as AuthenticatedUser;
    await this.userService.changePassword(user.usersId, changePasswordDto);
    return ResponseBuilder.success(
      null,
      'Contraseña cambiada exitosamente',
    ) as UserNullResponseDto;
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email de recuperación enviado',
    type: UserNullResponseDto,
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
  async requestPasswordRecovery(
    @Body() recoveryDto: RequestPasswordRecoveryDto,
  ): Promise<UserNullResponseDto> {
    await this.userService.requestPasswordRecovery(recoveryDto.email);
    return ResponseBuilder.success(
      null,
      'Si el email existe, recibirás instrucciones para recuperar tu contraseña',
    ) as UserNullResponseDto;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña restablecida exitosamente',
    type: UserNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o expirado',
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
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
  ): Promise<UserNullResponseDto> {
    await this.userService.resetPassword(resetDto);
    return ResponseBuilder.success(
      null,
      'Contraseña restablecida exitosamente',
    ) as UserNullResponseDto;
  }

  @Delete('deactivate')
  @UseGuards(SecureCustomerGuard)
  @ApiSecurity('custmrpomtkn')
  @ApiSecurity('api-key')
  @ApiOperation({ summary: 'Desactivar cuenta de usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cuenta desactivada exitosamente',
    type: UserNullResponseDto,
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
  async deactivateAccount(
    @Req() request: Request,
  ): Promise<UserNullResponseDto> {
    const user = request.user as AuthenticatedUser;
    await this.userService.deactivateAccount(user.usersId);
    return ResponseBuilder.success(
      null,
      'Cuenta desactivada exitosamente',
    ) as UserNullResponseDto;
  }

  @Get('check-availability')
  @ApiOperation({ summary: 'Verificar disponibilidad de username o email' })
  @ApiQuery({
    name: 'username',
    required: false,
    description: 'Username a verificar',
    example: 'juanperez',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Email a verificar',
    example: 'juan@example.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultado de verificación',
    type: UserNullResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros inválidos',
    schema: createErrorSchemas()[400],
  })
  @ApiResponse({
    status: 500,
    description: 'Error del servidor',
    schema: createErrorSchemas()[500],
  })
  async checkAvailability(
    @Query('username') username?: string,
    @Query('email') email?: string,
  ): Promise<UserNullResponseDto> {
    const isAvailable = await this.userService.checkAvailability(
      username,
      email,
    );
    return ResponseBuilder.success(
      null,
      isAvailable ? 'Disponible' : 'No disponible',
    ) as UserNullResponseDto;
  }

  @Post('resend-activation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reenviar código de activación' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Código de activación reenviado',
    type: UserNullResponseDto,
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
  async resendActivation(
    @Body() body: { email: string },
  ): Promise<UserNullResponseDto> {
    await this.userService.resendActivationCode(body.email);
    return ResponseBuilder.success(
      null,
      'Código de activación reenviado',
    ) as UserNullResponseDto;
  }
}
