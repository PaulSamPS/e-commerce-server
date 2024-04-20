import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CodeModel } from '@/modules/code/code.model';
import { addHours } from 'date-fns';
import { MailService } from '@/modules/mail/mail.service';
import { CodeDto } from '@/modules/code/dto/code.dto';

@Injectable()
export class CodeService {
  constructor(
    @InjectModel(CodeModel)
    private readonly codeModel: typeof CodeModel,
    private readonly mailService: MailService,
  ) {}

  /**
   * Отправляет или обновляет код активации по электронной почте.
   * @param codeDto Объект с данными для отправки кода активации.
   * @returns Объект с сообщением об успешной отправке кода.
   */
  async sendCode(
    codeDto: Pick<CodeDto, 'email'>,
  ): Promise<{ message: string }> {
    const existingCode = await this.codeModel.findOne({
      where: { email: codeDto.email },
    });
    const code = Math.floor(1000 + Math.random() * 9000);

    const userCode = existingCode || new CodeModel();
    userCode.email = codeDto.email;
    userCode.code = code;

    try {
      await userCode.save();
      await this.mailService.sendCode(codeDto.email, code);
      return { message: 'Код отправлен' };
    } catch (error) {
      if (!userCode.id) {
        await userCode.destroy();
      }
      throw new BadRequestException({ message: 'Ошибка при отправке кода' });
    }
  }

  /**
   * Проверяет введенный код активации и его срок действия.
   * Если код существует и не просрочен, удаляет его из базы данных.
   * @param codeDto Объект с данными для проверки кода активации.
   * @returns Объект с сообщением о результате проверки кода.
   */
  async enterCode(codeDto: CodeDto): Promise<{ message: string }> {
    const existingCode = await this.codeModel.findOne({
      where: { email: codeDto.email, code: codeDto.code },
    });

    if (!existingCode) {
      throw new BadRequestException({ message: 'Получите новый код' });
    }

    const isCodeValid = new Date() < addHours(existingCode.updatedAt, 1);

    if (!isCodeValid) {
      await existingCode.destroy();
      throw new ForbiddenException({ message: 'Код просрочен' });
    }

    await existingCode.destroy();
    return { message: 'Код принят' };
  }
}
