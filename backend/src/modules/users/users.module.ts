// users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { User } from 'src/database/entities/user.entity';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PrismaModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
