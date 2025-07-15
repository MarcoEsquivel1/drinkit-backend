import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Admin } from '../../infrastructure/database/entities/admin.entity';
import { EncryptionService } from '../../../shared/infrastructure/services/encryption.service';
import { AuthenticationData } from '../../infrastructure/auth/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private encryptionService: EncryptionService,
  ) {}

  async validateAdmin(
    email: string,
    password: string,
  ): Promise<AuthenticationData | null> {
    const admin = await this.adminRepository.findOne({
      where: { email, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!admin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = this.encryptionService.comparePassword(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!admin.enabled) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    return {
      id: admin.id,
      photo: admin.photo || '',
      name: admin.name || '',
      surname: admin.surname || '',
      enabled: admin.enabled || false,
      isLoggedIn: true,
      role: {
        id: admin.role?.rolesId || 0,
        name: admin.role?.name || '',
      },
    };
  }

  async updateLoginStatus(adminId: string, isLoggedIn: boolean): Promise<void> {
    await this.adminRepository.update(
      { id: adminId },
      { isLoggedIn, updatedAt: new Date() },
    );
  }

  async initiatePasswordRecovery(email: string): Promise<void> {
    const admin = await this.adminRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });

    if (!admin) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    await this.adminRepository.update(
      { id: admin.id },
      {
        resetToken,
        resetExpires,
        updatedAt: new Date(),
      },
    );

    // TODO: Implementar envío de email con el token
    // await this.emailService.sendPasswordRecoveryEmail(email, resetToken);
  }

  async changePassword(uuid: string, newPassword: string): Promise<void> {
    const admin = await this.adminRepository.findOne({
      where: {
        resetToken: uuid,
        deletedAt: IsNull(),
      },
    });

    if (!admin) {
      throw new NotFoundException('Token de recuperación inválido');
    }

    if (!admin.resetExpires || admin.resetExpires < new Date()) {
      throw new UnauthorizedException('Token de recuperación expirado');
    }

    const hashedPassword = this.encryptionService.encryptPasswd(newPassword);

    await this.adminRepository.update(
      { id: admin.id },
      {
        password: hashedPassword,
        resetToken: undefined,
        resetExpires: undefined,
        updatedAt: new Date(),
      },
    );
  }
}
