import { ApiProperty } from '@nestjs/swagger';

type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export class LoginResponseType {
  @ApiProperty({
    example: {
      id: 1,
      username: 'user',
      email: 'example@mail.com',
      createdAt: '2024-04-05T18:19:27.772Z',
      updatedAt: '2024-04-05T18:19:27.772Z',
    },
    description: 'Информация о пользователе',
  })
  user: User;

  @ApiProperty({
    example: 'Успешный вход в систему',
    description: 'Сообщение о результате входа',
  })
  message: string;
}
