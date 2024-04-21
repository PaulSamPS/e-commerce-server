import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersModel } from './users.model';
import { CreateUserDto } from '@/modules/users/dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { LoginUserDto } from '@/modules/users/dto';
import * as bcrypt from 'bcrypt';
import { CodeService } from '@/modules/code/code.service';
import { JwtTokenService } from '@/modules/token';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@/modules/mail/mail.service';
import * as crypto from 'crypto';
import { ResetPasswordDto } from '@/modules/users/dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly userModel: typeof UsersModel,
    private readonly authService: JwtTokenService,
    private readonly codeService: CodeService,
    private readonly mailService: MailService,
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

  private async generateResetToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }

  private async updateUserResetToken(
    user: UsersModel,
    token: string,
  ): Promise<void> {
    user.resetToken = token;
    user.resetTokenExp = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await user.save();
  }

  async sendResetToken(resetPasswordDto: Pick<ResetPasswordDto, 'email'>) {
    const user = await this.findOne({ email: resetPasswordDto.email });

    if (!user) {
      throw new ForbiddenException('Пользователь не найден');
    }

    const token = await this.generateResetToken();
    await this.updateUserResetToken(user, token);

    return this.codeService.sendCode(resetPasswordDto);
  }

  async checkResetToken(resetPasswordDto: ResetPasswordDto) {
    const user = await this.findOne({ email: resetPasswordDto.email });

    if (!user) {
      throw new ForbiddenException('Неверный токен сброса пароля');
    }

    return await this.codeService.enterCode({
      email: resetPasswordDto.email,
      code: resetPasswordDto.code,
    });
  }

  async refresh(access: string) {
    return await this.jwtService.decode(access);
  }
}
