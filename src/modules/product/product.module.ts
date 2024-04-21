import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductModel } from './product.model';
import { FilesService } from '@/modules/files';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel])],
  controllers: [ProductController],
  providers: [ProductService, FilesService],
  exports: [ProductService],
})
export class ProductModule {}
