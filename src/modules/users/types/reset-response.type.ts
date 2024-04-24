import { ApiProperty } from '@nestjs/swagger';

export class EnterCodeResponseType {
  @ApiProperty({
    example: 'Код принят',
    description: 'Сообщение об успешной успешном вводе кода для смены пароля',
  })
  message: string;
}

export class SendCodeResponseType {
  @ApiProperty({
    example: 'Код принят',
    description: 'Сообщение об успешной отправки кода',
  })
  message: string;
}
