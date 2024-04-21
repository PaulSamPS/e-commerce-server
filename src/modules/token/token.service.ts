import { TokensModel } from '@/modules/token/token.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokensModel)
    private readonly tokensModel: typeof TokensModel,
  ) {}

  /**
   * Найти токены по идентификатору пользователя.
   * @param userId Идентификатор пользователя.
   * @returns Объект с данными токенов или undefined, если токены не найдены.
   */
  async findByUserId(userId: number): Promise<TokensModel | undefined> {
    return this.tokensModel.findOne({ where: { userId } });
  }

  async create(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<TokensModel> {
    try {
      return await this.tokensModel.create({
        userId,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw new Error(`Ошибка при создании записи о токенах: ${error}`);
    }
  }

  /**
   * Обновить запись о токенах.
   * @param tokens Объект с данными токенов для обновления.
   */
  async update(tokens: TokensModel): Promise<void> {
    try {
      await tokens.save();
    } catch (error) {
      throw new Error(`Ошибка при обновлении записи о токенах: ${error}`);
    }
  }
}
