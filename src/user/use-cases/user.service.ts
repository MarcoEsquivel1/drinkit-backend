import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  User,
  Role,
  UsersAddress,
  UsersDevice,
  UsersFavorite,
  UsersInvoice,
  UsersRequest,
  UsersTransaction,
} from '../infrastructure/database/entities';
import { UserGender } from '../../shared/infrastructure/database/entities/enums';
import {
  RegisterUserDto,
  ActivateAccountDto,
  ChangePasswordDto,
  UpdateUserDto,
  ResetPasswordDto,
  UserResponseDto,
} from '../interfaces/dtos';
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UsersAddress)
    private usersAddressRepository: Repository<UsersAddress>,
    @InjectRepository(UsersDevice)
    private usersDeviceRepository: Repository<UsersDevice>,
    @InjectRepository(UsersFavorite)
    private usersFavoriteRepository: Repository<UsersFavorite>,
    @InjectRepository(UsersInvoice)
    private usersInvoiceRepository: Repository<UsersInvoice>,
    @InjectRepository(UsersRequest)
    private usersRequestRepository: Repository<UsersRequest>,
    @InjectRepository(UsersTransaction)
    private usersTransactionRepository: Repository<UsersTransaction>,
  ) {
    super();
  }

  async register(registerDto: RegisterUserDto): Promise<UserResponseDto> {
    try {
      this.logInfo('Iniciando registro de usuario', {
        username: registerDto.username,
        email: registerDto.email,
      });

      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Obtener rol por defecto (customer)
      const defaultRole = await this.roleRepository.findOne({
        where: { name: 'customer' },
      });
      if (!defaultRole) {
        throw new NotFoundException('Rol por defecto no encontrado');
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(registerDto.password, 12);

      // Mapear género
      const userGender = this.mapGenderToEnum(registerDto.gender);

      // Crear usuario
      const user = this.userRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        name: `${registerDto.firstname} ${registerDto.lastname}`.trim(),
        phone: registerDto.phone || undefined,
        birthdate: registerDto.birthdate
          ? new Date(registerDto.birthdate)
          : undefined,
        gender: userGender,
        enabled: false, // Requiere activación
        verify: false, // Requiere verificación de email
        role: defaultRole,
        createdBy: 'system',
      });

      const savedUser = await this.userRepository.save(user);

      // TODO: Enviar email de activación
      // await this.sendActivationEmail(savedUser.email, activationCode);

      this.logInfo('Usuario registrado exitosamente', { userId: savedUser.id });

      return this.mapToUserResponse(savedUser);
    } catch (error) {
      this.handleServiceError(error, 'Error en registro de usuario');
    }
  }

  async activateAccount(activateDto: ActivateAccountDto): Promise<void> {
    try {
      this.logInfo('Activando cuenta de usuario', {
        email: activateDto.email,
      });

      // TODO: Validar código de activación
      // const isValidCode = await this.validateActivationCode(activateDto.email, activateDto.code);
      // if (!isValidCode) {
      //   throw new BadRequestException('Código de activación inválido o expirado');
      // }

      // Por ahora, activar directamente
      const user = await this.userRepository.findOne({
        where: { email: activateDto.email },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (user.enabled && user.verify) {
        throw new BadRequestException('La cuenta ya está activada');
      }

      user.enabled = true;
      user.verify = true;
      await this.userRepository.save(user);

      this.logInfo('Cuenta activada exitosamente', { userId: user.id });
    } catch (error) {
      this.handleServiceError(error, 'Error activando cuenta');
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      this.handleServiceError(error, 'Error obteniendo perfil');
    }
  }

  async updateProfile(
    userId: string,
    updateDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      this.logInfo('Actualizando perfil de usuario', { userId });

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (updateDto.email && updateDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateDto.email },
        });
        if (existingUser && existingUser.id !== userId) {
          throw new ConflictException('El email ya está en uso');
        }
        // Si se cambia el email, requerir nueva verificación
        user.verify = false;
      }

      // Actualizar campos disponibles
      if (updateDto.email) user.email = updateDto.email;
      if (updateDto.phone) user.phone = updateDto.phone || undefined;
      if (updateDto.firstname || updateDto.lastname) {
        const firstname = updateDto.firstname || user.name.split(' ')[0] || '';
        const lastname =
          updateDto.lastname || user.name.split(' ').slice(1).join(' ') || '';
        user.name = `${firstname} ${lastname}`.trim();
      }
      if (updateDto.gender) {
        user.gender = this.mapGenderToEnum(updateDto.gender);
      }

      user.updatedBy = 'user';

      const updatedUser = await this.userRepository.save(user);

      this.logInfo('Perfil actualizado exitosamente', { userId });

      return this.mapToUserResponse(updatedUser);
    } catch (error) {
      this.handleServiceError(error, 'Error actualizando perfil');
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    try {
      this.logInfo('Cambiando contraseña de usuario', { userId });

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Contraseña actual incorrecta');
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        12,
      );
      user.password = hashedPassword;

      await this.userRepository.save(user);

      this.logInfo('Contraseña cambiada exitosamente', { userId });
    } catch (error) {
      this.handleServiceError(error, 'Error cambiando contraseña');
    }
  }

  async requestPasswordRecovery(email: string): Promise<void> {
    try {
      this.logInfo('Solicitando recuperación de contraseña', { email });

      const user = await this.userRepository.findOne({
        where: { email },
      });

      // No revelar si el email existe o no por seguridad
      if (!user) {
        this.logInfo('Email no encontrado para recuperación', { email });
        return;
      }

      // TODO: Generar token de recuperación y enviar email
      // const resetToken = await this.generatePasswordResetToken(user.id);
      // await this.sendPasswordResetEmail(email, resetToken);

      this.logInfo('Email de recuperación enviado', { email });
    } catch (error) {
      this.handleServiceError(
        error,
        'Error enviando recuperación de contraseña',
      );
    }
  }

  async resetPassword(resetDto: ResetPasswordDto): Promise<void> {
    try {
      this.logInfo('Restableciendo contraseña con token');

      // TODO: Validar token de recuperación
      // const userId = await this.validatePasswordResetToken(resetDto.token);
      // if (!userId) {
      //   throw new BadRequestException('Token inválido o expirado');
      // }

      // Por ahora, buscar usuario por token simulado
      // En producción, el token estaría en una tabla separada
      const user = await this.userRepository.findOne({
        where: { email: resetDto.token }, // Simulación - usar email como token
      });

      if (!user) {
        throw new BadRequestException('Token inválido o expirado');
      }

      // Hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(resetDto.newPassword, 12);
      user.password = hashedPassword;

      await this.userRepository.save(user);

      this.logInfo('Contraseña restablecida exitosamente', { userId: user.id });
    } catch (error) {
      this.handleServiceError(error, 'Error restableciendo contraseña');
    }
  }

  async deactivateAccount(userId: string): Promise<void> {
    try {
      this.logInfo('Desactivando cuenta de usuario', { userId });

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      user.enabled = false;
      user.updatedBy = 'user';
      await this.userRepository.save(user);

      this.logInfo('Cuenta desactivada exitosamente', { userId });
    } catch (error) {
      this.handleServiceError(error, 'Error desactivando cuenta');
    }
  }

  async checkAvailability(username?: string, email?: string): Promise<boolean> {
    try {
      if (!username && !email) {
        throw new BadRequestException('Debe proporcionar username o email');
      }

      let existingUser: User | null = null;

      if (email) {
        existingUser = await this.userRepository.findOne({
          where: { email },
        });
      }

      if (!existingUser && username) {
        // Para username, buscar en el campo name
        existingUser = await this.userRepository.findOne({
          where: { name: username },
        });
      }

      return !existingUser; // true si está disponible
    } catch (error) {
      this.handleServiceError(error, 'Error verificando disponibilidad');
    }
  }

  async resendActivationCode(email: string): Promise<void> {
    try {
      this.logInfo('Reenviando código de activación', { email });

      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        // No revelar si el email existe
        return;
      }

      if (user.enabled && user.verify) {
        throw new BadRequestException('La cuenta ya está activada');
      }

      // TODO: Generar y enviar nuevo código de activación
      // const activationCode = await this.generateActivationCode(user.id);
      // await this.sendActivationEmail(email, activationCode);

      this.logInfo('Código de activación reenviado', { email });
    } catch (error) {
      this.handleServiceError(error, 'Error reenviando código de activación');
    }
  }

  private mapToUserResponse(user: User): UserResponseDto {
    const nameParts = user.name.split(' ');
    const firstname = nameParts[0] || '';
    const lastname = nameParts.slice(1).join(' ') || '';

    return {
      userId: user.id,
      username: user.email, // Usar email como username
      active: user.enabled || false,
      firstname,
      lastname,
      email: user.email,
      phone: user.phone || undefined,
      verify: user.verify || false,
      birthdate: user.birthdate,
      photo: user.photo || undefined,
      gender: user.gender as string,
      companyname: '',
      business: '',
      channel: '',
      fullName: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || user.createdAt,
    };
  }

  private mapGenderToEnum(gender?: string): UserGender {
    switch (gender?.toUpperCase()) {
      case 'M':
      case 'MALE':
        return UserGender.MALE;
      case 'F':
      case 'FEMALE':
        return UserGender.FEMALE;
      case 'O':
      case 'OTHER':
        return UserGender.OTHER;
      case 'N':
      case 'PREFER_NOT_TO_SAY':
        return UserGender.PREFER_NOT_TO_SAY;
      default:
        return UserGender.OTHER;
    }
  }
}
