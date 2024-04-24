import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { CreateUserDto, LoginUserDto } from '@/modules/users/dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import * as bcrypt from 'bcrypt';
import { CodeService } from '@/modules/code/code.service';
import { JwtTokenService } from '@/modules/token';
import { JwtService } from '@nestjs/jwt';
import { EnterCodeResetPasswordDto } from '@/modules/users/dto/enter-code-reset-password.dto';
import { SendCodeResetPasswordDto } from '@/modules/users/dto/send-code-reset-password.dto';
import { NewPasswordDto } from '@/modules/users/dto/new-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly userModel: typeof UsersModel,
    private readonly authService: JwtTokenService,
    private readonly codeService: CodeService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly excludedFields = ['password', 'isAdmin', 'resetToken'];

  /**
   * Находит пользователя по указанным параметрам фильтра.
   * @param filter Параметры фильтрации пользователя.
   * @returns Объект пользователя.
   */
  async findOne(
    filter: Partial<{
      id?: number;
      username?: string;
      email?: string;
      resetToken?: string;
    }>,
  ): Promise<UsersModel> {
    return this.userModel.findOne({ where: { ...filter } });
  }

  /**
   * Находит публичные данные пользователя по указанным параметрам фильтра.
   * @param filter Параметры фильтрации пользователя.
   * @returns Публичные данные пользователя.
   */
  async findOnePublic(
    filter: Partial<{ id?: number; username?: string; email?: string }>,
  ): Promise<UsersModel> {
    return this.userModel.findOne({
      where: { ...filter },
      attributes: { exclude: this.excludedFields },
    });
  }

  /**
   * Проверяет наличие пользователя с указанным email или username.
   * @param email Email пользователя.
   * @param username Имя пользователя.
   */
  private async checkExistingUser(
    email: string,
    username: string,
  ): Promise<void> {
    const [existingByEmail, existingByUsername] = await Promise.all([
      this.findOne({ email }),
      this.findOne({ username }),
    ]);

    if (existingByEmail) {
      throw new ForbiddenException('Пользователь с таким email уже существует');
    }

    if (existingByUsername) {
      throw new ForbiddenException(
        'Пользователь с таким username уже существует',
      );
    }
  }

  /**
   * Регистрирует нового пользователя.
   * @param createUserDto Данные нового пользователя.
   * @returns Сообщение об успешной регистрации.
   */
  async register(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { email, username, password } = createUserDto;

    await this.checkExistingUser(email, username);

    const hashedPassword = await bcrypt.hash(password, 10);

    let user: UsersModel;
    try {
      user = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Не удалось создать пользователя.',
      );
    }

    try {
      await this.codeService.sendCode({ email });
      return { message: 'Регистрация прошла успешно.' };
    } catch (error) {
      await user.destroy();
      throw new InternalServerErrorException(
        'Не удалось отправить код активации.',
      );
    }
  }

  /**
   * Активирует пользователя по коду активации.
   * @param activateUserDto Данные для активации пользователя.
   * @returns Сообщение об успешной активации.
   */
  async activate(
    activateUserDto: ActivateUserDto,
  ): Promise<{ message: string }> {
    const { email, code } = activateUserDto;

    const user = await this.findOne({ email });
    if (!user) {
      throw new NotFoundException('Пользователь не найден.');
    }

    try {
      await this.codeService.enterCode({ email, code });

      user.activated = true;
      await user.save();

      return { message: 'Активация прошла успешно.' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Пользователь не найден.');
      } else {
        throw new InternalServerErrorException(
          'Не удалось активировать пользователя.',
        );
      }
    }
  }

  /**
   * Аутентифицирует пользователя.
   * @param loginUserDto Данные для аутентификации пользователя.
   * @returns Токены доступа и обновления.
   */
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.findOne({ email });

    if (!user || !user.activated) {
      throw new UnauthorizedException('Аккаунт не найден или не активирован.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль.');
    }

    const userData = await this.findOnePublic({ email });

    const token = await this.authService.generateJwtToken({ user: userData });

    return { token, user: userData };
  }

  async sendResetPasswordCode(
    sendCodeResetPasswordDto: SendCodeResetPasswordDto,
  ) {
    const user = await this.findOne({ email: sendCodeResetPasswordDto.email });

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    return this.codeService.sendCode(sendCodeResetPasswordDto);
  }

  async enterResetPasswordCode(
    enterCodeResetPasswordDto: EnterCodeResetPasswordDto,
  ) {
    const user = await this.findOne({ email: enterCodeResetPasswordDto.email });

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    return await this.codeService.enterCode({
      email: enterCodeResetPasswordDto.email,
      code: enterCodeResetPasswordDto.code,
    });
  }

  async newPassword(newPasswordDto: NewPasswordDto) {
    const user = await this.findOne({ email: newPasswordDto.email });

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    user.password = await bcrypt.hash(newPasswordDto.password, 10);

    await user.save();

    return { message: 'Пароль изменен' };
  }

  async refresh(access: string) {
    return await this.jwtService.decode(access);
  }
}
