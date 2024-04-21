import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.auth_access;
    const { user } = await this.jwtService.decode(token);
    const { isAdmin } = await this.userService.findOne({ id: user.id });

    if (!isAdmin) {
      throw new ForbiddenException('Доступ запрещен'); // Используем ForbiddenException для отказа в доступе
    }

    // Проверяем, является ли пользователь администратором
    return true;
  }
}
