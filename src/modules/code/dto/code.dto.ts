import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CodeDto {
  @ApiProperty({
    description: 'Адрес электронной почты',
    example: 'example@example.com',
  })
  @IsNotEmpty({ message: 'Поле "email" должно быть заполнено' })
  @IsString({ message: 'Поле "email" должно быть строкой' })
  readonly email: string;

  @ApiProperty({ description: 'Код активации', example: '1234' })
  @IsNotEmpty({ message: 'Поле "code" должно быть заполнено' })
  @IsString({ message: 'Поле "code" должно быть строкой' })
  readonly code: string;
}
