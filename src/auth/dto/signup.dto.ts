import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'TEST_LOGIN' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'TEST_PASSWORD' })
  @IsString()
  password: string;
}
