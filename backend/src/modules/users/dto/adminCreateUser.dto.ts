import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { UUID } from 'crypto';

export class AdminCreateUserDto {
  id: UUID;

  @IsEnum(Role, {
    message: `Roles must be ${Object.values(Role).join(', ')}`,
  })
  role: Role;
}