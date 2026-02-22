import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@prisma/client';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken?: string; 
}
