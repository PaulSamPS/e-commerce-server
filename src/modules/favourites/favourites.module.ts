import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { ProductsModule } from '@/modules/product';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavouritesModel } from '@/modules/favourites/favourites.model';

@Module({
  imports: [SequelizeModule.forFeature([FavouritesModel]), ProductsModule],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
