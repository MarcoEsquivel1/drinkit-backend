import { Entity, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { AuditedWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';

@Entity('apple_fallbacks')
export class AppleFallback extends AuditedWithIdEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  @ApiProperty({ description: 'ID único de Apple' })
  @IsString()
  @Expose()
  appleId: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Apellido del usuario' })
  @IsOptional()
  @IsString()
  @Expose()
  lastname?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  @Expose()
  firstname?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Email del usuario' })
  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiPropertyOptional({ description: 'Nombre completo para mostrar' })
  @IsOptional()
  @IsString()
  @Expose()
  displayName?: string;

  @Column({ type: 'text', nullable: true })
  @ApiPropertyOptional({ description: 'URL de la foto del usuario' })
  @IsOptional()
  @IsString()
  @Expose()
  photo?: string;
}
