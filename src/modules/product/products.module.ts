import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModel } from './products.model';
import { FilesService } from '@/modules/files';

@Module({
  imports: [SequelizeModule.forFeature([ProductsModel])],
  controllers: [ProductsController],
  providers: [ProductsService, FilesService],
  exports: [ProductsService],
})
export class ProductsModule {}
