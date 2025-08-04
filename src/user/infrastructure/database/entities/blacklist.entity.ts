import { Entity, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';

@Entity('blacklist')
export class Blacklist extends AuditedWithIdEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  @ApiProperty({ description: 'Email del usuario en blacklist' })
  @IsEmail()
  @Expose()
  email: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'Razón de la suspensión' })
  @IsOptional()
  @IsString()
  @Expose()
  reason?: string;
}
