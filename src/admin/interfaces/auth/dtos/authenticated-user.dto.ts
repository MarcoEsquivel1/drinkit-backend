import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDto {
  @ApiProperty({ description: 'ID del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  surname: string;

  @ApiProperty({ description: 'Estado habilitado del usuario' })
  enabled: boolean;

  @ApiProperty({ description: 'Estado de login del usuario' })
  isLoggedIn: boolean;

  @ApiProperty({
    description: 'Rol del usuario',
    type: 'object',
    properties: {
      id: { type: 'number', description: 'ID del rol' },
      name: { type: 'string', description: 'Nombre del rol' },
    },
  })
  role: {
    id: number;
    name: string;
  };
}
