import { CookieOptions, Response as ExpressResponse } from 'express';

export function setAuthCookie(
  res: ExpressResponse,
  token: string,
  name: string,
): void {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
  };

  if (name === 'auth_access') {
    cookieOptions.maxAge = 15 * 60 * 1000; // 15 минут в миллисекундах
  } else {
    cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
  }

  res.cookie(name, token, cookieOptions);
}
