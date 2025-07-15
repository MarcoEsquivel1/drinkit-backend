import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdminService } from '../use-cases/admin.service';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from './dtos';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminResponseDto> {
    const admin = await this.adminService.create(createAdminDto);
    return plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<AdminResponseDto[]> {
    const admins = await this.adminService.findAll();
    return admins.map((admin) =>
      plainToInstance(AdminResponseDto, admin, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    const admin = await this.adminService.findOne(id);
    return plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminResponseDto> {
    const admin = await this.adminService.update(id, updateAdminDto);
    return plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.adminService.remove(id);
  }
}
