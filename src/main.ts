import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Запускает Nest.js приложение.
 * Создает экземпляр приложения, применяет настройки, подключает Swagger документацию и слушает указанный порт.
 */
async function bootstrap() {
  // Создание экземпляра приложения Nest.js
  const app = await NestFactory.create(AppModule);

  // Получение сервиса конфигурации
  const configService = app.get(ConfigService);

  // Получение порта из конфигурации
  const port = configService.get<number>('PORT');

  // Использование cookieParser для обработки cookie
  app.use(cookieParser(configService.get<string>('BASE_URL')));

  // Глобальное применение ValidationPipe для валидации входных данных
  app.useGlobalPipes(new ValidationPipe());

  // Включение CORS с настройками из конфигурации
  app.enableCors({
    credentials: true,
    origin: configService.get<string>('BASE_URL'),
  });

  // Настройка Swagger документации
  const swaggerConfig = new DocumentBuilder()
    .setTitle('e-commerce') // Заголовок документации
    .setDescription('API Documentation') // Описание документации
    .setVersion('1.0') // Версия API
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Прослушивание указанного порта
  await app.listen(port);
}

// Запуск функции bootstrap для запуска приложения
bootstrap();
