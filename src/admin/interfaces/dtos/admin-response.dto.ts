import { Expose } from 'class-transformer';
import { UserGender } from '../../../shared/infrastructure/database/entities/enums';

export class AdminResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  enabled: boolean;

  @Expose()
  phone?: string;

  @Expose()
  photo?: string;

  @Expose()
  gender: UserGender;

  @Expose()
  roleId?: number;

  @Expose()
  isLoggedIn?: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt?: Date;
}
