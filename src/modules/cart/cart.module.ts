import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartModel } from './cart.model';
import { CartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/modules/users';
import { ProductsModule } from '@/modules/product';

@Module({
  imports: [
    SequelizeModule.forFeature([CartModel]),
    JwtModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
