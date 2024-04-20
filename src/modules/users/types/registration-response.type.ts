import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseType {
  @ApiProperty({
    example: 'Регистрация прошла успешно.',
    description: 'Сообщение о результате регистрации',
  })
  message: string;
}
