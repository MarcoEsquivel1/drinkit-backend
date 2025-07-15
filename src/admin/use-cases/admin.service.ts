import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../infrastructure/database/entities/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from '../interfaces/dtos';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const admin = this.adminRepository.create({
      ...createAdminDto,
      createdBy: 'system',
    });
    return this.adminRepository.save(admin);
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({
      relations: ['role'],
    });
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    Object.assign(admin, {
      ...updateAdminDto,
      updatedBy: 'system',
    });

    return this.adminRepository.save(admin);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findOne(id);
    await this.adminRepository.softRemove(admin);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }
}
