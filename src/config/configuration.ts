import { registerAs } from '@nestjs/config';

/**
 * Конфигурация базы данных.
 * Загружает параметры подключения к базе данных из переменных окружения.
 * По умолчанию используется PostgreSQL, логгирование включено, хост - localhost,
 * порт - 5425, имя пользователя - commerce, пароль - commerce, название базы данных - commerce.
 * Автоматическая загрузка сущностей и синхронизация схемы базы данных включены.
 */
export const databaseConfig = registerAs('database', () => ({
  dialect: process.env.SQL_DIALECT || 'postgres',
  logging: process.env.SQL_LOGGING === 'true',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 5425,
  username: process.env.DATABASE_USER || 'commerce',
  password: process.env.DATABASE_PASSWORD || 'commerce',
  database: process.env.DATABASE_NAME || 'commerce',
  autoLoadEntities: true,
  synchronize: true,
}));
