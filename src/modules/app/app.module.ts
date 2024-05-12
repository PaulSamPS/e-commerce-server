import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, SequelizeConfigService } from '@/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '@/modules/users';
import { CodeModule } from '@/modules/code/code.module';
import { TokenModule } from '@/modules/token';
import { MulterModule } from '@nestjs/platform-express';
import { ReviewModule } from '@/modules/review/review.module';
import { FeaturesModule } from '@/modules/features/features.module';
import { ProductsModule } from '@/modules/product';
import { FilesModule } from '@/modules/files';
import { SharesModule } from '@/modules/shares/shares.module';
import { DayProductsModule } from '@/modules/day-products/day-products.module';
import { CartModule } from '@/modules/cart';
import { ScheduleModule } from '@nestjs/schedule';
import { FavouritesModule } from '@/modules/favourites/favourites.module';
import { ProfileModule } from '@/modules/profile/profile.module';

/**
 * Модуль приложения, который объединяет все остальные модули и провайдеры.
 * Здесь также определяются настройки приложения и подключаются модули базы данных, пользователей, кодов и токенов.
 */
@Module({
  imports: [
    // Подключение модуля конфигурации для загрузки настроек
    ConfigModule.forRoot({
      load: [databaseConfig], // Загрузка конфигурации базы данных
      isGlobal: true, // Определение глобального доступа к конфигурации
    }),

    ScheduleModule.forRoot(),

    // Подключение модуля Sequelize для работы с базой данных
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService, // Использование сервиса для настройки подключения к базе данных
    }),

    // Подключение модуля пользователей
    UsersModule,

    // Подключение модуля кодов активации
    CodeModule,

    // Подключение модуля токенов
    TokenModule,
    ReviewModule,
    FeaturesModule,
    ProductsModule,
    FilesModule,
    SharesModule,
    CartModule,
    DayProductsModule,
    FavouritesModule,
    ProfileModule,
    MulterModule.register({ dest: './uploads ' }),
  ],
})
export class AppModule {}
