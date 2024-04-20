import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { RegistrationResponseType, LoginResponseType } from './types';
import { ActivateResponseType } from '@/modules/users/types/activate-response.type';
import { ActivateUserDto } from '@/modules/users/dto/activate-user.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { Response as ExpressResponse, Request as ExpressRequest } from 'express';
import { JwtTokenService } from '@/modules/token';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: JwtTokenService,
  ) {}

  /**
   * Регистрирует нового пользователя.
   * @param createUserDto Данные нового пользователя.
   * @returns Ответ о результате регистрации.
   */
  @ApiOkResponse({ type: RegistrationResponseType })
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationResponseType> {
    return this.userService.register(createUserDto);
  }

  /**
   * Активирует пользователя по коду активации.
   * @param activateUserDto Данные для активации пользователя.
   * @returns Ответ о результате активации.
   */
  @ApiOkResponse({ type: ActivateResponseType })
  @Post('activate')
  async activate(
    @Body() activateUserDto: ActivateUserDto,
  ): Promise<ActivateResponseType> {
    return this.userService.activate(activateUserDto);
  }

  /**
   * Авторизует пользователя и выдает ему JWT токены.
   * @param loginUserDto Данные для авторизации пользователя.
   * @param res Объект ответа Express.
   * @returns Сообщение о успешном входе.
   */
  @ApiOkResponse({ type: LoginResponseType })
  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ){
    const {token, user} = await this.userService.login(loginUserDto);
    this.setAuthCookie(res, token.accessToken, 'auth_access');
    this.setAuthCookie(res, token.refreshToken, 'auth_refresh');
    return { user, message: 'Вход успешно выполнен' };
  }

  /**
   * Обновляет access токен пользователя.
   * @returns Результат обновления токена.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('refresh-token')
  async refreshToken(@Req() req: ExpressRequest) {
    return await this.userService.refresh(req.cookies['auth_access'] || req.cookies['auth_refresh'])
  }

  /**
   * Устанавливает cookie для аутентификации.
   * @param res Объект ответа Express.
   * @param token Токен для установки в cookie.
   * @param name Имя cookie.
   */
  private setAuthCookie(
    res: ExpressResponse,
    token: string,
    name: string,
  ): void {
    res.cookie(name, token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: false,
    });
  }
}
