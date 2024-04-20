import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    // Проверка наличия конфигурации SMTP перед созданием экземпляра MailService
    this.validateSmtpConfiguration();

    // Создание транспортера для отправки почты
    this.transporter = nodemailer.createTransport({
      host: configService.get('smtp_host'),
      port: configService.get('smtp_port'),
      secure: true,
      auth: {
        user: configService.get('smtp_user'),
        pass: configService.get('smtp_password'),
      },
    });
  }

  /**
   * Отправляет код по электронной почте.
   * @param to Адрес электронной почты, на который отправляется код.
   * @param subject Тема письма.
   * @param html HTML содержимое письма.
   */
  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: this.configService.get('smtp_user'),
      to,
      subject,
      text: '',
      html,
    });
  }

  /**
   * Отправляет код подтверждения по электронной почте.
   * @param to Адрес электронной почты, на который отправляется код.
   * @param code Код подтверждения.
   */
  async sendCode(to: string, code: number | string) {
    const subject = `Код подтверждения ${this.configService.get('BASE_URL')}`;
    const html = `
      <div>
        <h1>Код активации</h1>
        <span>Ваш код</span>
        <h2>${code}</h2>
      </div>
    `;
    await this.sendEmail(to, subject, html);
  }

  /**
   * Отправляет код для сброса пароля по электронной почте.
   * @param to Адрес электронной почты, на который отправляется код.
   * @param code Код для сброса пароля.
   */
  async sendResetCode(to: string, code: string) {
    const subject = `Восстановление пароля ${this.configService.get(
      'BASE_URL',
    )}`;
    const html = `
      <div>
        <h1>Забыли пароль?</h1>
        <p>Если нет, то проигнорируйте данное письмо</p>
        <p>Если да, то введите код для восстановления пароля</p>
        <p>Код действителен 1 час</p>
        <h2>${code}</h2>
      </div>
    `;
    await this.sendEmail(to, subject, html);
  }

  /**
   * Проверяет наличие конфигурации SMTP перед созданием экземпляра MailService.
   * Если какой-либо параметр конфигурации отсутствует, выбрасывает ошибку.
   */
  private validateSmtpConfiguration(): void {
    const requiredParams = [
      'smtp_host',
      'smtp_port',
      'smtp_user',
      'smtp_password',
    ];

    for (const param of requiredParams) {
      if (!this.configService.get(param)) {
        throw new Error(`Отсутствует конфигурация SMTP: ${param}`);
      }
    }
  }
}
