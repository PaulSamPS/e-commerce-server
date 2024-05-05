import { Response as ExpressResponse } from 'express';

export function clearCookie(res: ExpressResponse, name: string): void {
  res.clearCookie(name);
}
