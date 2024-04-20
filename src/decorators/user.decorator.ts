import { createParamDecorator } from '@nestjs/common';

/**
 * Декоратор аутентификации, извлекающий данные пользователя из запроса.
 * Если передан ключ данных, возвращает значение этого ключа из объекта пользователя.
 * Если ключ данных не передан, возвращает весь объект пользователя.
 * @param data Ключ данных пользователя, который требуется извлечь.
 * @param ctx Контекст запроса.
 * @returns Значение ключа данных пользователя или весь объект пользователя.
 */
export const AuthDecorator = createParamDecorator((data: string, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const auth = req.auth;

  if (!auth) {
    return undefined;
  }

  return data ? auth.user?.[data] : auth.user;
});
