import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeOptionsFactory,
  SequelizeModuleOptions,
} from '@nestjs/sequelize';
import { UsersModel } from '@/modules/users';
import { CodeModel } from '@/modules/code/code.model';
import { Dialect } from 'sequelize';
import { ReviewModel } from '@/modules/review/review.model';

/**
 * Интерфейс для описания конфигурации базы данных.
 */
interface DatabaseConfig {
  dialect: Dialect;
  logging: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: boolean;
  synchronize: boolean;
}

/**
 * Сервис для настройки параметров Sequelize.
 * Реализует интерфейс SequelizeOptionsFactory.
 */
@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Метод для создания опций конфигурации Sequelize.
   * @returns Опции конфигурации Sequelize.
   */
  createSequelizeOptions(): SequelizeModuleOptions {
    // Получаем конфигурацию базы данных из конфигурационного сервиса
    const databaseConfig = this.configService.get<DatabaseConfig>('database');

    // Возвращаем опции конфигурации Sequelize, основанные на конфигурации базы данных
    return {
      ...databaseConfig,
      models: [UsersModel, CodeModel, ReviewModel],
      autoLoadModels: true,
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    };
  }
}
