import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password1234',
  database: 'mydb',
  autoLoadEntities: true,
  synchronize: true, // DEV ONLY
};
