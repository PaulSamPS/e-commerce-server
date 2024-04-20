import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TokenModule } from 'src/modules/token';
import { UsersController } from './users.controller';
import { UsersModel } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CodeModule } from '@/modules/code/code.module';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel]), TokenModule, CodeModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
