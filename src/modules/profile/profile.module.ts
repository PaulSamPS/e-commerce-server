import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProfileModel } from '@/modules/profile/profile.model';
import { FilesService } from '@/modules/files';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([ProfileModel])],
  controllers: [ProfileController],
  providers: [ProfileService, FilesService, JwtService],
})
export class ProfileModule {}
