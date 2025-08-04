import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../infrastructure/database/entities/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from '../interfaces/dtos';
import { BaseService } from '../../shared/services/base.service';
import { Paginated } from '../../shared/utils/paginated.util';

@Injectable()
export class AdminService extends BaseService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super();
  }

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const admin = this.adminRepository.create({
        ...createAdminDto,
        createdBy: 'system',
      });
      const savedAdmin = await this.adminRepository.save(admin);
      this.logInfo('Administrador creado exitosamente', { id: savedAdmin.id });
      return savedAdmin;
    } catch (error) {
      this.handleServiceError(error, 'Error al crear administrador');
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      const admins = await this.adminRepository.find({
        relations: ['role'],
      });
      this.logInfo(`Se encontraron ${admins.length} administradores`);
      return admins;
    } catch (error) {
      this.handleServiceError(error, 'Error al obtener administradores');
    }
  }

  async findAllPaginated(
    page: number,
    size: number,
  ): Promise<{ data: Admin[]; count: number }> {
    try {
      const validatedPage = Paginated.validatePage(page);
      const validatedSize = Paginated.getLimit(size);
      const offset = Paginated.getOffset(validatedPage, validatedSize);

      const [data, count] = await this.adminRepository.findAndCount({
        relations: ['role'],
        skip: offset,
        take: validatedSize,
        order: { createdAt: 'DESC' },
      });

      this.logInfo(
        `Se encontraron ${count} administradores (página ${validatedPage}, tamaño ${validatedSize})`,
      );
      return { data, count };
    } catch (error) {
      this.handleServiceError(
        error,
        'Error al obtener administradores paginados',
      );
    }
  }

  async findOne(id: string): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id },
        relations: ['role'],
      });

      if (!admin) {
        this.createNotFoundError('Administrador', id);
      }

      return admin;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al obtener administrador con ID ${id}`,
      );
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    try {
      const admin = await this.findOne(id);

      Object.assign(admin, {
        ...updateAdminDto,
        updatedBy: 'system',
      });

      const updatedAdmin = await this.adminRepository.save(admin);
      this.logInfo('Administrador actualizado exitosamente', {
        id: updatedAdmin.id,
      });
      return updatedAdmin;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al actualizar administrador con ID ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const admin = await this.findOne(id);
      await this.adminRepository.softRemove(admin);
      this.logInfo('Administrador eliminado exitosamente', { id });
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al eliminar administrador con ID ${id}`,
      );
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      const admin = await this.adminRepository.findOne({
        where: { email },
        relations: ['role'],
      });
      return admin;
    } catch (error) {
      this.handleServiceError(
        error,
        `Error al buscar administrador por email ${email}`,
      );
    }
  }
}
