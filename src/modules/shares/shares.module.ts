import { Module } from '@nestjs/common';
import { SharesController } from './shares.controller';
import { SharesService } from './shares.service';
import { FilesService } from '@/modules/files';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharesModel } from '@/modules/shares/shares.model';

@Module({
  imports: [SequelizeModule.forFeature([SharesModel])],
  controllers: [SharesController],
  providers: [SharesService, FilesService, JwtService],
})
export class SharesModule {}
