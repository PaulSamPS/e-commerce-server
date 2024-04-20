import { ApiProperty } from '@nestjs/swagger';

export class ActivateResponseType {
  @ApiProperty({
    example: 'Код принят',
    description: 'Сообщение об успешной активации',
  })
  message: string;
}
