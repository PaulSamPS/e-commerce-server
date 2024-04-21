import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtTokenService } from '@/modules/token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  /**
   * Проверяет наличие и валидность JWT токенов в куки запроса.
   * Если истекает access токен и присутствует refresh токен, обновляет их и сохраняет в куки.
   * @param context Контекст выполнения запроса.
   * @returns true, если пользователь аутентифицирован и имеет доступ к ресурсу, иначе - false.
   * @throws UnauthorizedException если аутентификация не удалась.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { access, refresh } = this.extractTokenFromCookie(request);

    // Проверка наличия токенов в куки запроса
    if (!access && !refresh) {
      throw new UnauthorizedException('Токен не найден в куки.');
    }

    try {
      // Проверка access токена
      await this.verifyAccessToken(access);
      return true;
    } catch {
      // Обновление токенов, если access токен невалиден
      await this.refreshTokenIfNeeded(response, refresh);
      return true;
    }
  }

  /**
   * Проверяет валидность access токена.
   * @param accessToken Access токен.
   * @throws UnauthorizedException если access токен невалиден.
   */
  private async verifyAccessToken(accessToken: string): Promise<void> {
    await this.jwtService.verifyAsync(accessToken, {
      secret: this.getJwtSecretAccess(),
    });
  }

  /**
   * Проверяет и обновляет токены, если access токен недействителен.
   * @param response Ответ сервера.
   * @param refreshToken Refresh токен.
   * @throws UnauthorizedException если refresh токен отсутствует или недействителен.
   */
  private async refreshTokenIfNeeded(response: Response, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Истек срок действия токена и отсутствует refresh токен.',
      );
    }

    await this.jwtService.verifyAsync(refreshToken, {
      secret: this.getJwtSecretRefresh(),
    });

    const { accessToken, newRefreshToken } =
      await this.jwtTokenService.refreshTokens(refreshToken);

    this.updateCookieTokens(response, accessToken, newRefreshToken);
  }

  /**
   * Обновляет токены в куки запроса.
   * @param response Ответ сервера.
   * @param accessToken Новый access токен.
   * @param refreshToken Новый refresh токен.
   */
  private updateCookieTokens(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    this.setAuthCookie(response, accessToken, 'auth_access');
    this.setAuthCookie(response, refreshToken, 'auth_refresh');
  }

  /**
   * Извлекает access и refresh токены из куки запроса.
   * @param request Запрос.
   * @returns Объект с access и refresh токенами.
   */
  private extractTokenFromCookie(request: Request): {
    access: string;
    refresh: string;
  } {
    const { auth_access: access = '', auth_refresh: refresh = '' } =
      request.cookies;
    return { access, refresh };
  }

  /**
   * Получает секретный ключ для проверки access JWT токена из конфигурации.
   * @returns Секретный ключ для access токена.
   * @throws InternalServerErrorException если секретный ключ не найден в конфигурации.
   */
  private getJwtSecretAccess(): string {
    const secret = this.configService.get<string>('JWT_SECRET_ACCESS') || '';
    if (!secret) {
      throw new InternalServerErrorException(
        'Секрет JWT для access токена не найден в конфигурации.',
      );
    }
    return secret;
  }

  /**
   * Получает секретный ключ для проверки refresh JWT токена из конфигурации.
   * @returns Секретный ключ для refresh токена.
   * @throws InternalServerErrorException если секретный ключ не найден в конфигурации.
   */
  private getJwtSecretRefresh(): string {
    const secret = this.configService.get<string>('JWT_SECRET_REFRESH') || '';
    if (!secret) {
      throw new InternalServerErrorException(
        'Секрет JWT для refresh токена не найден в конфигурации.',
      );
    }
    return secret;
  }

  /**
   * Устанавливает куки для авторизации.
   * @param response Ответ сервера.
   * @param token Токен для установки.
   * @param name Название куки.
   */
  private setAuthCookie(response: Response, token: string, name: string): void {
    response.cookie(name, token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: false,
    });
  }
}
