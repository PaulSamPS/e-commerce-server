import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { RegistrationResponseType, LoginResponseType } from './types';
import { ActivateResponseType } from '@/modules/users/types/activate-response.type';
import { ActivateUserDto } from '@/modules/users/dto/activate-user.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { setAuthCookie } from '@/lib/set-auth-cookie';
import { ResetPasswordDto } from '@/modules/users/dto/reset-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
  ) {
    const { token, user } = await this.userService.login(loginUserDto);
    setAuthCookie(res, token.accessToken, 'auth_access');
    setAuthCookie(res, token.refreshToken, 'auth_refresh');
    return { user, message: 'Вход успешно выполнен' };
  }

  @Post('/reset-password/send-code')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() email: Pick<LoginUserDto, 'email'>) {
    return this.userService.sendResetToken(email);
  }

  @Post('/reset-password/enter-code')
  @HttpCode(HttpStatus.OK)
  checkPassToken(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.checkResetToken(resetPasswordDto);
  }

  /**
   * Обновляет access токен пользователя.
   * @returns Результат обновления токена.
   */
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Get('refresh-token')
  async refreshToken(@Req() req: ExpressRequest) {
    return await this.userService.refresh(
      req.cookies['auth_access'] || req.cookies['auth_refresh'],
    );
  }
}
