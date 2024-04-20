import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '@/modules/token/token.service';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Генерирует новые токены доступа и обновления для пользователя.
   * @param payload Пользовательские данные для токенов.
   * @returns Объект с accessToken и refreshToken.
   */
  async generateJwtToken(
    payload: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.signToken(payload.user, 'access');
    const refreshToken = this.signToken(payload.user, 'refresh');

    await this.saveTokens(payload.user.id, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  /**
   * Обновляет токены доступа и обновления по refreshToken.
   * @param refreshToken Токен обновления.
   * @returns Объект с accessToken и refreshToken.
   */
  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; newRefreshToken: string }> {
    // Проверяем валидность токена обновления и извлекаем пользователя из него
    const { user } = this.verifyToken(refreshToken, 'refresh');

    // Поиск токена в базе данных для пользователя
    const dbToken = await this.tokenService.findByUserId(user.id);

    // Проверяем, соответствует ли токен из базы данных переданному токену обновления
    if (dbToken.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Невалидный токен');
    }

    // Создаем новый токен доступа и токен обновления
    const accessToken = this.signToken(user, 'access');
    const newRefreshToken = this.signToken(user, 'refresh');

    // Обновляем токены в базе данных
    await this.saveTokens(user.id, accessToken, newRefreshToken);

    // Возвращаем новые токены
    return { accessToken, newRefreshToken };
  }

  // Приватные методы

  /**
   * Создает JWT токен для пользователя.
   * @param user Пользовательские данные.
   * @param type Тип токена ('access' или 'refresh').
   * @returns Сгенерированный JWT токен.
   */
  private signToken<T>(user: T, type: 'access' | 'refresh'): string {
    const secretKey = this.getJwtSecret(type);
    const expiresIn = this.getJwtTokenExpiresIn(type);

    return this.jwtService.sign({ user }, { secret: secretKey, expiresIn });
  }

  /**
   * Сохраняет токены доступа и обновления в базе данных.
   * @param userId Идентификатор пользователя.
   * @param accessToken Токен доступа.
   * @param refreshToken Токен обновления.
   */
  private async saveTokens(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    let tokens = await this.tokenService.findByUserId(userId);

    if (!tokens) {
      tokens = await this.tokenService.create(
        userId,
        accessToken,
        refreshToken,
      );
    } else {
      tokens.accessToken = accessToken;
      tokens.refreshToken = refreshToken;
      return this.tokenService.update(tokens);
    }
  }

  /**
   * Проверяет и верифицирует JWT токен.
   * @param token JWT токен для верификации.
   * @param type Тип токена ('access' или 'refresh').
   * @returns Проверенный объект пользователя.
   */
  private verifyToken(token: string, type: 'access' | 'refresh'): any {
    const secretKey = this.getJwtSecret(type);
    return this.jwtService.verify(token, { secret: secretKey });
  }

  /**
   * Получает секретный ключ JWT токена из конфигурации.
   * @param type Тип токена ('access' или 'refresh').
   * @returns Секретный ключ JWT токена.
   * @throws InternalServerErrorException Если секретный ключ не найден.
   */
  private getJwtSecret(type: 'access' | 'refresh'): string {
    const secretKey = this.configService.get<string>(
      `JWT_SECRET_${type.toUpperCase()}`,
    );

    if (!secretKey) {
      throw new InternalServerErrorException(
        `Секретный ключ для токена ${type.toUpperCase()} не найден`,
      );
    }

    return secretKey;
  }

  /**
   * Получает срок действия JWT токена из конфигурации.
   * @param type Тип токена ('access' или 'refresh').
   * @returns Срок действия JWT токена.
   * @throws InternalServerErrorException Если срок действия не найден.
   */
  private getJwtTokenExpiresIn(type: 'access' | 'refresh'): string {
    const expiresIn = this.configService.get<string>(
      `JWT_${type.toUpperCase()}_TOKEN_EXPIRES_IN`,
    );

    if (!expiresIn) {
      throw new InternalServerErrorException(
        `Срок действия токена ${type.toUpperCase()} не найден`,
      );
    }

    return expiresIn;
  }
}
